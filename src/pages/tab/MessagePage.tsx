import { IonContent, IonHeader, IonInfiniteScroll, IonInfiniteScrollContent, IonList, IonPage, IonSpinner } from '@ionic/react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import PageContentCmp from '../../components/container/PageContentCmp';
import NotificationPremiumCmp from '../../components/notification/NotificationPremiumCmp';
import MainToolbarCmp from '../../components/toolbar/MainToolbarCmp';
import { ConversationDTO } from '../../model/conversation/dto/conversation.dto';
import { getAvatar } from '../../model/image/image.helper';
import { TYPE_IMAGE } from '../../model/image/type-image.enum';
import { PATHS } from '../../router/paths';
import { AppDispatch, RootState } from '../../store';
import { loadMoreConversationThunk } from '../../store/conversation/conversation.thunk';
import { HomeState } from '../../store/home/home.slice';
import { syncProfile } from '../../store/message/message.slice';
import { getTimeSince } from '../../utils/time.helper';
import styles from './MessagePage.module.scss';

const MessagePage: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const history = useHistory();
    /* State */
    const { loading, conversations, isDataAvailable, currentPage } = useSelector((state: RootState) => state.conversation);
    const { isBlockMessagePage } = useSelector((state: RootState) => state.home) as HomeState;

    const chatSelectedHandler = (conversation: ConversationDTO) => {
        //if (!conversation.isSeen) dispatch(seenConversationThunk(conversation.id));
        dispatch(
            syncProfile({
                avatar: getAvatar(conversation.other.avatar, TYPE_IMAGE.SQUARE, conversation.other.gender),
                gender: conversation.other.gender,
                name: conversation.other.name,
                id: conversation.other.profileId,
                disabled: conversation.other.disabled,
            }),
        );
        history.push(`/${PATHS.DIRECT}/${conversation.id}`);
    };

    const loadMoreDataHandler = (e: any) => {
        if (!isDataAvailable) return;
        dispatch(loadMoreConversationThunk(currentPage + 1)).then(() => e.target.complete());
    };

    return (
        <IonPage className="destinee__bg">
            <IonHeader>
                <MainToolbarCmp></MainToolbarCmp>
            </IonHeader>
            <PageContentCmp tabOffset={true} title="Tin nhắn">
                {isBlockMessagePage && <NotificationPremiumCmp />}
                <div className={styles.container}>
                    {loading && <IonSpinner color="white" name="crescent" className="m-auto" />}
                    {!loading && conversations.length <= 0 && (
                        <div className="emptyList">
                            <h2>Bạn chưa có cuộc trò chuyện nào</h2>
                            <div className="line" />
                            <p>Hãy thử nhắn tin với người bạn đã gọi điện đi</p>
                        </div>
                    )}
                    {!loading && conversations.length > 0 && (
                        <div className={styles.contentContainer}>
                            <IonContent className={styles.content}>
                                <IonList className={styles.list} lines="inset">
                                    {conversations.map((info) => {
                                        return (
                                            <div
                                                className={classNames([styles.messageContainer], {
                                                    [styles.unseenMessage]: !info.isSeen,
                                                })}
                                                key={info.id}
                                                onClick={() => chatSelectedHandler(info)}>
                                                <img
                                                    src={getAvatar(info.other.avatar, TYPE_IMAGE.SQUARE, info.other.gender)}
                                                    alt="avatar"
                                                />
                                                <div className={styles.infoContainer}>
                                                    <div>
                                                        <b>{info.other.name}</b>
                                                        <span className={styles.lastMessageAt}>
                                                            {` - ${
                                                                info.lastMessageAt
                                                                    ? getTimeSince(new Date(info.lastMessageAt))
                                                                    : '1 phút'
                                                            } trước`}
                                                        </span>
                                                    </div>
                                                    <p className={styles.message}>{info.lastMessage}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </IonList>
                                <IonInfiniteScroll
                                    onIonInfinite={loadMoreDataHandler}
                                    threshold="100px"
                                    disabled={!isDataAvailable}>
                                    <IonInfiniteScrollContent
                                        loadingSpinner="crescent"
                                        loadingText="Đang tải thêm cuộc trò chuyện..."
                                    />
                                </IonInfiniteScroll>
                            </IonContent>
                        </div>
                    )}
                </div>
            </PageContentCmp>
        </IonPage>
    );
};

export default MessagePage;
