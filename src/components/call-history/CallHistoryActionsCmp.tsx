import { IonIcon, IonRippleEffect, useIonToast } from '@ionic/react';
import classNames from 'classnames';
import {
    chatbubblesOutline,
    checkmarkDoneCircleOutline,
    peopleOutline,
    personAddOutline,
} from 'ionicons/icons';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import slugify from 'slugify';
import { ConversationDTO } from '../../model/conversation/dto/conversation.dto';
import { FRIEND_REQUEST_STATUS } from '../../model/friend-request/friend-request-status.enum';
import { ImageDTO } from '../../model/image/dto/image.dto';
import { getAvatar } from '../../model/image/image.helper';
import { TYPE_IMAGE } from '../../model/image/type-image.enum';
import { GENDER } from '../../model/profile/profile.constant';
import { PATHS } from '../../router/paths';
import { AppDispatch, RootState } from '../../store';
import { addFriendThunk, verifyFriendRequestThunk } from '../../store/call-history/call-history.thunk';
import { createConversationThunk } from '../../store/conversation/conversation.thunk';
import { syncProfile } from '../../store/message/message.slice';
import { getToast } from '../../utils/toast.helper';
import ModalContainerCmp from '../container/ModalContainerCmp';
import NotificationFriendRequestCmp from '../notification/NotificationFriendRequestCmp';
import styles from './CallHistoryActionsCmp.module.scss';
import { FriendRequest } from './CallHistoryCardCmp';
import { updateDisabled as updateCallHistoryDisabled } from '../../store/call-history/call-history.slice';
import { updateDisabled as updateConversationDisabled } from '../../store/conversation/conversation.slice';
import { MBTI_TYPE } from '../../model/personality-test/mbti-type.enum';
import { disableProfileThunk } from '../../store/common.disable';

interface ACTION_BUTTON {
    name: string;
    icon: string;
    onClickHandler: () => void;
}

const CallHistoryActionsCmp: React.FC<{
    friendRequest: FriendRequest | null;
    profileId: string;
    avatar?: ImageDTO | string;
    name: string;
    mbtiType: MBTI_TYPE | null;
    compatibility: number | undefined;
    gender: GENDER;
    conversationId: string | undefined;
    disabled: boolean;
}> = ({ friendRequest, profileId, avatar, name, compatibility, mbtiType, gender, conversationId, disabled }) => {
    const dispatch: AppDispatch = useDispatch();
    const history = useHistory();
    /* Selector */
    const { _id } = useSelector((state: RootState) => state.profile);
    const [modal, setModal] = useState<{
        id: string;
        name: string;
        avatar: ImageDTO | string | undefined;
        compatibility?: number;
        mbtiType: MBTI_TYPE | null;
    } | null>(null);

    const [present, dismiss] = useIonToast();
    const disableToaster = getToast('Tài khoản bị vô hiệu hóa', dismiss, 3000);

    const friendRequestOptions = (friendRequest: FriendRequest | null): ACTION_BUTTON | null => {
        const defaultOption = {
            name: 'Kết bạn',
            icon: personAddOutline,
            onClickHandler: async () => {
                if (disabled) {
                    present(disableToaster('Người dùng đã bị vô hiệu hóa', 'fail'));
                    return;
                }
                const { meta, payload } = await dispatch(addFriendThunk({ profileId }));
                if (meta.requestStatus === 'rejected' && payload === '404') {
                    present(
                        disableToaster('Người dùng này đã bị vô hiệu hóa, bạn không thể gửi lời mời từ người dùng này', 'fail'),
                    );
                    dispatch(disableProfileThunk(profileId));
                }
            },
        };

        if (!friendRequest) return defaultOption;
        if (friendRequest.status === FRIEND_REQUEST_STATUS.DENIED && friendRequest.verifier === _id) return defaultOption;
        if (friendRequest.status === FRIEND_REQUEST_STATUS.DENIED && friendRequest.requester === _id) return null;
        if (friendRequest.status === FRIEND_REQUEST_STATUS.PENDING && friendRequest.requester === _id)
            return {
                name: 'Đã gửi',
                icon: checkmarkDoneCircleOutline,
                onClickHandler: () => {
                    if (disabled) present(disableToaster('Người dùng đã bị vô hiệu hóa', 'fail'));
                },
            };
        if (friendRequest.status === FRIEND_REQUEST_STATUS.PENDING && (friendRequest.verifier === _id || !friendRequest.verifier))
            return {
                name: 'Đồng ý',
                icon: personAddOutline,
                onClickHandler: () => {
                    disabled
                        ? present(disableToaster('Người dùng đã bị vô hiệu hóa', 'fail'))
                        : setModal({ id: profileId, name, avatar, mbtiType, compatibility });
                },
            };
        if (friendRequest.status === FRIEND_REQUEST_STATUS.ACCEPTED)
            return {
                name: 'Bạn bè',
                icon: peopleOutline,
                onClickHandler: () => {
                    disabled
                        ? present(disableToaster('Người dùng đã bị vô hiệu hóa', 'fail'))
                        : history.push(`/${PATHS.FRIEND}/${profileId}/${slugify(name, { lower: true })}`);
                },
            };
        return defaultOption;
    };

    const friendRequestOption = friendRequestOptions(friendRequest);
    const actions: ACTION_BUTTON[] = [
        // {
        //     name: 'Gọi',
        //     icon: callOutline,
        //     onClickHandler: function () {
        //         console.log('Click');
        //     },
        // },
        {
            name: 'Nhắn tin',
            icon: chatbubblesOutline,
            onClickHandler: async function () {
                if (conversationId) history.push(`/${PATHS.DIRECT}/${conversationId}`);
                else if (!conversationId && disabled) present(disableToaster('Người dùng đã bị vô hiệu hóa', 'fail'));
                else {
                    const result = await dispatch(
                        createConversationThunk({
                            body: { profileId },
                            profile: {
                                avatar: getAvatar(avatar, TYPE_IMAGE.SQUARE, gender),
                                gender,
                                name,
                                id: profileId,
                                disabled,
                            },
                        }),
                    );
                    if (result.meta.requestStatus === 'fulfilled') {
                        const conversation = result.payload as ConversationDTO;
                        dispatch(
                            syncProfile({
                                avatar: getAvatar(avatar, TYPE_IMAGE.SQUARE, gender),
                                gender,
                                name,
                                id: profileId,
                                disabled,
                            }),
                        );
                        history.push(`/${PATHS.DIRECT}/${conversation.id}`);
                    }
                }
            },
        },
        // {
        //     name: 'Ghi âm',
        //     icon: micOutline,
        //     onClickHandler: function () {
        //         console.log('Click');
        //     },
        // },
    ];
    if (friendRequestOption) actions.push(friendRequestOption);

    return (
        <div className={styles.container}>
            <ModalContainerCmp open={modal !== null} onClose={() => setModal(null)}>
                {modal !== null && (
                    <NotificationFriendRequestCmp
                        name={modal.name}
                        avatar={modal.avatar}
                        compatibility={modal.compatibility}
                        mbtiType={modal.mbtiType}
                        gender={gender}
                        onConfirm={async () => {
                            const { meta, payload } = await dispatch(verifyFriendRequestThunk({ isAccept: true, profileId }));
                            if (meta.requestStatus === 'rejected' && payload === '404') {
                                present(
                                    disableToaster(
                                        'Người dùng này đã bị vô hiệu hóa, bạn không thể chấp nhận lời mời từ người dùng này',
                                        'fail',
                                    ),
                                );
                                dispatch(updateConversationDisabled({ profileId }));
                                dispatch(updateCallHistoryDisabled({ profileId }));
                                // phần friend chờ update API
                            }
                            setModal(null);
                        }}
                        onDelete={async () => {
                            const { meta, payload } = await dispatch(verifyFriendRequestThunk({ isAccept: false, profileId }));
                            if (meta.requestStatus === 'rejected' && payload === '404') {
                                present(
                                    disableToaster(
                                        'Người dùng này đã bị vô hiệu hóa, bạn không thể chấp nhận lời mời từ người dùng này',
                                        'fail',
                                    ),
                                );
                                dispatch(updateConversationDisabled({ profileId }));
                                dispatch(updateCallHistoryDisabled({ profileId }));
                                // phần friend chờ update API
                            }
                            setModal(null);
                        }}
                    />
                )}
            </ModalContainerCmp>
            {actions.map((action) => (
                <button
                    type="button"
                    onClick={action.onClickHandler}
                    key={action.name}
                    className={classNames(['ion-activatable', 'ripple-parent'])}>
                    <div className={styles.btnContent}>
                        <IonIcon icon={action.icon} />
                        {action.name}
                    </div>
                    <IonRippleEffect />
                </button>
            ))}
        </div>
    );
};

export default CallHistoryActionsCmp;
