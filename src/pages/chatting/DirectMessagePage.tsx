import { IonFooter, IonHeader, IonIcon, IonInput, IonPage, IonSpinner, IonToolbar, useIonToast } from '@ionic/react';
import { sendSharp } from 'ionicons/icons';
import { isEmpty } from 'lodash';
import React, { useCallback, useEffect, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch, useSelector } from 'react-redux';
import ChatContentCmp from '../../components/chat/ChatContentCmp';
import PageContentCmp from '../../components/container/PageContentCmp';
import TitleToolbarCmp from '../../components/toolbar/TitleToolbarCmp';
import { getAvatar } from '../../model/image/image.helper';
import { TYPE_IMAGE } from '../../model/image/type-image.enum';
import { ExtendedRouteProps } from '../../router/pages';
import { PATHS } from '../../router/paths';
import { TAB_URL } from '../../router/tabs';
import { AppDispatch, RootState } from '../../store';
import { disableProfileThunk } from '../../store/common.disable';
import { HomeState } from '../../store/home/home.slice';
import { resetState as resetMessageState } from '../../store/message/message.slice';
import {
    fetchMessagesThunk,
    getOtherProfileThunk,
    loadMoreMessagesThunk,
    sendMessageThunk
} from '../../store/message/message.thunk';
import { clearNotificationTitle, NotificationState } from '../../store/notification/notification.slice';
import { ProfileState } from '../../store/profile/profile.slice';
import { getToast } from '../../utils/toast.helper';
import styles from './DirectMessagePage.module.scss';

const DirectMessagePage: React.FC<ExtendedRouteProps> = ({ match, history }) => {
    const dispatch: AppDispatch = useDispatch();
    const messageRef = useRef<HTMLIonInputElement>(null);
    const endRef = useRef<HTMLDivElement>(null);
    const { isBlockMessagePage } = useSelector((state: RootState) => state.home) as HomeState;
    const [present, dismiss] = useIonToast();
    const messageToast = getToast('Nhắn tin', dismiss, 1500);

    /* State */
    const { _id: profileId, avatar, personalInfo } = useSelector((state: RootState) => state.profile) as ProfileState;
    const { loading, messages, isDataAvailable, currentPage, otherProfile } = useSelector((state: RootState) => state.message);
    const { notificationTitle } = useSelector((state: RootState) => state.notification) as NotificationState;

    /* Handler */
    const scrollToEnd = () => {
        endRef.current && endRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    const pushNewMessageHandler = useCallback(
        async (content: string) => {
            if (!match.params.conversationId) return;
            const { meta, payload } = await dispatch(
                sendMessageThunk({ conversationId: match.params.conversationId, body: { content } }),
            );
            if (meta.requestStatus === 'rejected' && payload === '404') {
                present(messageToast('Người dùng này đã bị vô hiệu hóa, bạn không thể gửi tin nhắn cho người dùng này', 'fail'));
                dispatch(getOtherProfileThunk(match.params.conversationId!));
                dispatch(disableProfileThunk(otherProfile.id));
            }
        },
        [dispatch, match.params.conversationId, present, messageToast, otherProfile],
    );

    const inputNewMessageHandler = useCallback(() => {
        if (isEmpty(messageRef.current?.value)) return;
        pushNewMessageHandler(messageRef.current?.value as string);
        messageRef.current!.value = '';
        scrollToEnd();
    }, [pushNewMessageHandler]);

    const loadMoreDataHandler = () => {
        if (!isDataAvailable) return;
        if (!match.params.conversationId) return;
        const nextEndIndex = (currentPage + 1) * parseInt(process.env.REACT_APP_MESSAGE_LIMIT || '25');
        if (messages.length < nextEndIndex)
            dispatch(loadMoreMessagesThunk({ conversationId: match.params.conversationId, page: currentPage + 1 }));
    };

    /* Effect */
    useEffect(() => {
        if(notificationTitle) dispatch(clearNotificationTitle());
    }, [notificationTitle, dispatch]);

    useEffect(() => {
        if(isBlockMessagePage) history.replace(`${TAB_URL}/${PATHS.HOME}`);
        if (profileId && match.params.conversationId) {
            dispatch(fetchMessagesThunk(match.params.conversationId)).then((payload: any) => {
                if (payload.error) history.replace(`${TAB_URL}/${PATHS.MESSAGE}`);
            });
            if (isEmpty(otherProfile.id)) dispatch(getOtherProfileThunk(match.params.conversationId));
        }
    }, [isBlockMessagePage, history, match.params.conversationId, profileId, dispatch, otherProfile]);
    
    useEffect(() => {
        scrollToEnd();
        return () => { dispatch(resetMessageState()); }
    }, [dispatch]);

    useEffect(() => {
        if(otherProfile.disabled === true) dispatch(disableProfileThunk(otherProfile.id));
    }, [dispatch, otherProfile]);

    useEffect(() => {
        document.addEventListener('touchend', (e: any) => {
            if (e.target.id !== 'sendBtn') return;
            inputNewMessageHandler();
            e.preventDefault();
        });
    }, [inputNewMessageHandler]);

    return (
        <IonPage style={{ background: 'white' }}>
            <IonHeader>
                <TitleToolbarCmp title={otherProfile.name} blackTheme={true} />
            </IonHeader>
            {/* height không đủ do trong PageContentCmp có height: suitableHeight => bỏ là đủ */}
            <PageContentCmp scrollY={true} customStyle={{ height: '100%' }}>
                {loading && <IonSpinner color="black" name="crescent" className="m-auto" />}
                {!loading && messages.length > 0 && (
                    <div className={styles.conversation}>
                        <div className={styles.scrollContent} id="scrollDiv">
                            <InfiniteScroll
                                scrollableTarget="scrollDiv"
                                loader={
                                    <div className={styles.loadMoreContainer}>
                                        <IonSpinner color="grey" name="crescent" />
                                        <span>Đang tải thêm tin nhắn...</span>
                                    </div>
                                }
                                next={loadMoreDataHandler}
                                hasMore={isDataAvailable}
                                dataLength={currentPage * parseInt(process.env.REACT_APP_MESSAGE_LIMIT || '25')}
                                className={styles.infiniteScroll}
                                inverse={true}>
                                <div ref={endRef} className={styles.endDiv} />
                                {messages.map((message) => {
                                    return (
                                        <ChatContentCmp
                                            key={message.id}
                                            message={message}
                                            otherProfileId={otherProfile.id}
                                            name={otherProfile.name}
                                            avatar={
                                                message.isMine
                                                    ? getAvatar(avatar, TYPE_IMAGE.SQUARE, personalInfo.gender)
                                                    : getAvatar(otherProfile.avatar, TYPE_IMAGE.SQUARE, otherProfile.gender)
                                            }
                                        />
                                    );
                                })}
                            </InfiniteScroll>
                        </div>
                    </div>
                )}
            </PageContentCmp>
            <IonFooter>
                <IonToolbar className={styles.footerInput} color="white">
                    <div className={styles.messageInput}>
                        <IonInput
                            placeholder="Hãy nói gì đi..."
                            ref={messageRef}
                            onKeyPress={(e) => e.key === 'Enter' && inputNewMessageHandler()}
                            disabled={otherProfile.disabled}
                        />
                        <button type="button" className={styles.sendButton} onClick={inputNewMessageHandler}>
                            <IonIcon icon={sendSharp} id="sendBtn" />
                        </button>
                    </div>
                </IonToolbar>
            </IonFooter>
        </IonPage>
    );
};

export default DirectMessagePage;
