import { onMessage } from 'firebase/messaging';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import useSound from 'use-sound';
import bellSoftMp3 from '../assets/sound/bell-soft.mp3';
import { messaging } from '../firebase';
import { FRIEND_REQUEST_STATUS } from '../model/friend-request/friend-request-status.enum';
import { NOTIFICATION_TYPE } from '../model/notification/notification-type';
import { NotificationOverallRESP } from '../model/notification/response/notification-overall.response';
import { MBTI_TYPE } from '../model/personality-test/mbti-type.enum';
import { GENDER } from '../model/profile/profile.constant';
import { AppDispatch, RootState } from '../store';
import { AuthState } from '../store/auth/auth.slice';
import { changeStatusFriendRequest } from '../store/call-history/call-history.slice';
import { notificationHandleThunk } from '../store/conversation/conversation.thunk';
import { addFriendRequest } from '../store/friend-request/friend-request.slice';
import { appendFriendThunk } from '../store/friend/friend.thunk';
import { addOtherNewMessage, MessageState } from '../store/message/message.slice';
import { getMessageIdAndContent } from '../store/notification/notification.service';
import {
    addNotification,
    resetState as resetNotificationState,
    setError as setNotificationError,
} from '../store/notification/notification.slice';
import { NOTIFICATION_SEND, WS_EXCEPTION } from '../utils/gateway-event';
import { uid } from '../utils/random-id';
export interface UseNotificationSocketReturn {
    notificationSocket?: Socket;
}

export default function useNotificationSocket({ mainSocket }: { mainSocket?: Socket }): UseNotificationSocketReturn {
    const dispatch: AppDispatch = useDispatch();
    /* Sound */
    const [bellSoftSfx] = useSound(bellSoftMp3);
    /* State */
    const [notificationSocket, setNotificationSocket] = useState<Socket>();
    const { token } = useSelector((state: RootState) => state.auth) as AuthState;
    const { conversationId } = useSelector((state: RootState) => state.message) as MessageState;
    const [notification, setNotification] = useState<NOTIFICATION_TYPE>();

    /* Initialize Socket */
    useEffect(() => {
        if (!token || !mainSocket) return; // Bắt buộc cho mainSocket chạy trước để check lỗi run same browser twice -> tránh bị lỗi notificationSocket disconnect
        console.info('Init notification socket...');
        const socket = io(process.env.REACT_APP_SOCKET_URL + '/notification', {
            path: process.env.REACT_APP_SOCKET_PATH,
            auth: { Authorization: token },
            transports: ['websocket'],
        });
        setNotificationSocket(socket);
    }, [token, mainSocket]);

    useEffect(() => {
        /* Xử lý khi logout */
        if (!token && notificationSocket) {
            notificationSocket.disconnect();
        }
    }, [token, notificationSocket]);

    useEffect(() => {
        if (!notification) return;
        if (!conversationId) {
            if (navigator.vibrate) navigator.vibrate([100, 80, 100, 80, 100]);
            bellSoftSfx();
        }
        setNotification(undefined);
    }, [notification, conversationId, bellSoftSfx]);

    /* Handle Socket Event */
    useEffect(() => {
        if (!notificationSocket) return;
        notificationSocket.on(WS_EXCEPTION, (err: any) => {
            console.error(err);
            dispatch(setNotificationError(err));
        });
        notificationSocket.on('connect', () => {
            console.log('[Notification Socket] connected', notificationSocket.id);
        });
        notificationSocket.on('disconnect', () => {
            console.log('[Notification Socket] disconnected', notificationSocket.id);
            dispatch(resetNotificationState());
        });
        notificationSocket.on(NOTIFICATION_SEND, (data: NotificationOverallRESP) => {
            const { content } = getMessageIdAndContent(data.data?.content!);
            dispatch(
                addNotification({
                    id: data.id,
                    createdAt: data.createdAt,
                    isSeen: data.isSeen,
                    type: NOTIFICATION_TYPE[data.type],
                    data: data.data
                        ? {
                              id: data.data.id, // Đối với notification thì dù là DIRECT_MESSAGE, id vẫn là conversationId
                              profileId: data.data.profileId,
                              profileName: data.data.profileName,
                              content,
                              thumbnail: data.data.thumbnail,
                          }
                        : undefined,
                }),
            );

            switch (data.type) {
                case NOTIFICATION_TYPE.DIRECT_CALL:
                    break;
                case NOTIFICATION_TYPE.ANONYMOUS_CALL:
                    break;
                case NOTIFICATION_TYPE.ANONYMOUS_MESSAGE:
                    setNotification(NOTIFICATION_TYPE.ANONYMOUS_MESSAGE);
                    break;
                case NOTIFICATION_TYPE.DIRECT_MESSAGE:
                    setNotification(NOTIFICATION_TYPE.DIRECT_MESSAGE);
                    const { content, messageId } = getMessageIdAndContent(data.data?.content!);
                    dispatch(
                        notificationHandleThunk({
                            conversation: {
                                id: data.data?.id!,
                                isSeen: false,
                                lastMessage: content || '',
                                lastMessageAt: data.createdAt,
                                other: {
                                    avatar: data.data?.thumbnail!,
                                    gender: GENDER.MALE,
                                    name: data.data?.profileName!,
                                    profileId: data.data?.profileId!,
                                    disabled: false,
                                },
                            },
                            notificationId: data.id,
                        }),
                    );
                    dispatch(
                        addOtherNewMessage({
                            otherMessage: {
                                id: messageId || uid(),
                                content: content || '',
                                createdAt: data.createdAt,
                                isMine: false,
                                isLastMessage: true,
                            },
                            coversationId: data.data?.id!,
                        }),
                    );
                    break;
                case NOTIFICATION_TYPE.FRIEND_REQUEST:
                    dispatch(
                        addFriendRequest({
                            id: data.data?.id!,
                            profileId: data.data?.profileId!,
                            avatar: data.data?.thumbnail!,
                            createdAt: data.createdAt,
                            name: data.data?.profileName!,
                            gender: GENDER.MALE,
                            mbtiResult: data.data?.content ? MBTI_TYPE[data.data?.content] : null,
                        }),
                    );
                    dispatch(
                        changeStatusFriendRequest({
                            profileId: data.data?.profileId!,
                            status: FRIEND_REQUEST_STATUS.PENDING,
                            myPending: true,
                        }),
                    );
                    break;
                case NOTIFICATION_TYPE.FRIEND_REQUEST_ACCEPTED:
                    dispatch(
                        changeStatusFriendRequest({ profileId: data.data?.profileId!, status: FRIEND_REQUEST_STATUS.ACCEPTED }),
                    );
                    dispatch(appendFriendThunk(data.data?.profileId!));
                    break;
                case NOTIFICATION_TYPE.REPORT_HANDLED:
                    break;
                default:
                    break;
            }
        });
    }, [notificationSocket, dispatch]);

    messaging.then((msg) => {
        if (!msg) return;
        onMessage(msg, (payload) => {
            /* Chỗ này có thể là không cần làm gì cả vì notification triger thì mình sử dụng socket thay vì cloud-messaging */
            // console.log('[FCM] Foreground message', payload);
            // new Notification(payload.notification.title, { body: payload.notification.body });
        });
    });

    return {
        notificationSocket,
    };
}
