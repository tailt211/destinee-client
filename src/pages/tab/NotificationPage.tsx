import {
    IonContent,
    IonHeader,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonPage,
    IonSpinner,
    useIonToast,
} from '@ionic/react';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import slugify from 'slugify';
import ModalContainerCmp from '../../components/container/ModalContainerCmp';
import PageContentCmp from '../../components/container/PageContentCmp';
import NotificationCmp from '../../components/notification/NotificationCmp';
import NotificationFriendRequestCmp from '../../components/notification/NotificationFriendRequestCmp';
import NotificationReportCmp from '../../components/notification/NotificationReportCmp';
import MainToolbarCmp from '../../components/toolbar/MainToolbarCmp';
import { FriendRequestDTO } from '../../model/friend-request/dto/friend-request.dto';
import { NOTIFICATION_TYPE } from '../../model/notification/notification-type';
import { GENDER } from '../../model/profile/profile.constant';
import { PATHS } from '../../router/paths';
import { TAB_URL } from '../../router/tabs';
import { AppDispatch, RootState } from '../../store';
import { verifyFriendRequestThunk } from '../../store/friend-request/friend-request.thunk';
import { removeLoader, setLoader } from '../../store/notification/notification.slice';
import {
    archiveAllNotificationThunk,
    archiveNotificationThunk,
    fetchFriendRequestThunk,
    fetchUnseenNotificationCountThunk,
    loadMoreNotificationsThunk,
} from '../../store/notification/notification.thunk';
import { getToast } from '../../utils/toast.helper';
import styles from './NotificationPage.module.scss';

const NotificationPage: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const [present, dismiss] = useIonToast();
    const friendRequestToaster = getToast('Lời mời kết bạn', dismiss, 2000);
    const history = useHistory();
    /* State */
    const [modal, setModal] = useState<{
        id: string;
        type: NOTIFICATION_TYPE;
        friendRequest?: FriendRequestDTO;
        report?: {
            message: string;
            reason: string;
            punishmentType: string;
        };
        confirmHandler: () => void;
        denyHandler: () => void;
    } | null>(null);
    const { loading, loader, notifications, isDataAvailable, currentPage, unseenNotificationIds, totalCount } = useSelector(
        (state: RootState) => state.notification,
    );
    const { token } = useSelector((state: RootState) => state.auth);

    /* Effect */
    useEffect(() => {
        if (!token) return;
        dispatch(fetchUnseenNotificationCountThunk());
    }, [token, unseenNotificationIds, dispatch]);

    /* Handler */
    const loadMoreData = (e: any) => {
        if (!isDataAvailable) return;
        dispatch(loadMoreNotificationsThunk(currentPage + 1)).then(() => e.target.complete());
    };

    const clearAllNotificationHandler = () => {
        dispatch(archiveAllNotificationThunk());
    };

    const notificationHandler = (id: string, type: NOTIFICATION_TYPE, actionId?: string, profileId?: string, name?: string) => {
        if (loader[id]) return;
        dispatch(setLoader(id));
        switch (type) {
            case NOTIFICATION_TYPE.DIRECT_CALL:
                dispatch(archiveNotificationThunk(id));
                break;
            case NOTIFICATION_TYPE.ANONYMOUS_CALL:
                history.push(`${TAB_URL}/${PATHS.CALL_HISTORY}`);
                dispatch(archiveNotificationThunk(id));
                break;
            case NOTIFICATION_TYPE.ANONYMOUS_MESSAGE:
                history.push(`${TAB_URL}/${PATHS.MESSAGE}`);
                dispatch(archiveNotificationThunk(id));
                break;
            case NOTIFICATION_TYPE.DIRECT_MESSAGE:
                history.push(`/${PATHS.DIRECT}/${actionId}`);
                dispatch(archiveNotificationThunk(id));
                break;
            case NOTIFICATION_TYPE.FRIEND_REQUEST:
                dispatch(fetchFriendRequestThunk(actionId)).then((payload: any) => {
                    if (payload.error) {
                        present(friendRequestToaster(`Lời mời kết bạn không tồn tại`, 'fail'));
                        dispatch(archiveNotificationThunk(id));
                        return;
                    }
                    const friendRequest = payload.payload as FriendRequestDTO;
                    setModal({
                        id,
                        type,
                        friendRequest,
                        confirmHandler: () => {
                            dispatch(
                                verifyFriendRequestThunk({
                                    isAccept: true,
                                    profileId: friendRequest?.profileId,
                                }),
                            ).then((payload: any) => {
                                if (payload.meta.requestStatus === 'fulfilled')
                                    present(friendRequestToaster(`Bạn & ${friendRequest?.name} đã trở thành bạn bè`, 'success'));
                                if (payload.error) present(friendRequestToaster(`Lời mời kết bạn không tồn tại`, 'fail'));
                            });
                            dispatch(archiveNotificationThunk(id));
                        },
                        denyHandler: () => {
                            dispatch(
                                verifyFriendRequestThunk({
                                    isAccept: false,
                                    profileId: friendRequest?.profileId,
                                }),
                            ).then((payload: any) => {
                                if (payload.meta.requestStatus === 'fulfilled')
                                    present(friendRequestToaster(`Từ chối lời mời thành công`, 'success'));
                                if (payload.error) present(friendRequestToaster(`Lời mời kết bạn không tồn tại`, 'fail'));
                            });
                            dispatch(archiveNotificationThunk(id));
                        },
                    });
                });
                break;
            case NOTIFICATION_TYPE.FRIEND_REQUEST_ACCEPTED:
                history.push(`/${PATHS.FRIEND_PROFILE}/${profileId}${name && '/' + slugify(name, { lower: true })}`);
                dispatch(archiveNotificationThunk(id));
                break;
            case NOTIFICATION_TYPE.REPORT_HANDLED:
                // dispatch(fetchReportThunk(actionId)).then((payload: any) => {
                //     if (payload.error) return;
                setModal({
                    id,
                    type,
                    report: {
                        message: 'Báo cáo của bạn về vấn đề xúc phạm trong cuộc gọi đã được chúng tôi xem xét',
                        reason: 'Đối phương đã sử dụng một số từ ngữ lăng mạ bạn trong cuộc gọi, cụ thể là từ phút 12:30',
                        punishmentType: 'Khóa vĩnh viễn tài khoản',
                    },
                    confirmHandler: () => {
                        dispatch(archiveNotificationThunk(id));
                    },
                    denyHandler: () => {
                        dispatch(archiveNotificationThunk(id));
                    },
                });
                // });
                break;
            default:
                break;
        }
    };

    return (
        <IonPage className="destinee__bg">
            <IonHeader>
                <MainToolbarCmp />
            </IonHeader>
            <PageContentCmp tabOffset={true} title={!loading && totalCount === 0 ? 'Thông báo' : ''}>
                {notifications.length !== 0 && modal != null && (
                    <ModalContainerCmp
                        open={!!modal}
                        onClose={() => {
                            dispatch(removeLoader(modal.id));
                            setModal(null);
                        }}>
                        <NotificationFriendRequestCmp
                            avatar={modal.friendRequest?.avatar}
                            name={modal.friendRequest?.name || ''}
                            compatibility={modal.friendRequest?.compatibility}
                            mbtiType={modal.friendRequest?.mbtiResult?.type || null}
                            gender={modal.friendRequest?.gender || GENDER.MALE}
                            onConfirm={() => {
                                modal.confirmHandler();
                                setModal(null);
                            }}
                            onDelete={() => {
                                modal.denyHandler();
                                setModal(null);
                            }}
                        />
                        {modal.type === NOTIFICATION_TYPE.REPORT_HANDLED && (
                            <NotificationReportCmp
                                message={modal.report?.message || ''}
                                punishmentType={modal.report?.punishmentType || ''}
                                reason={modal.report?.reason || ''}
                                onConfirm={() => {
                                    modal.confirmHandler();
                                    setModal(null);
                                }}
                                onDelete={() => {
                                    modal.confirmHandler();
                                    setModal(null);
                                }}
                            />
                        )}
                    </ModalContainerCmp>
                )}
                <div className={styles.titleContainer}>
                    {loading && <IonSpinner color="white" name="crescent" className="m-auto" />}

                    {!loading && totalCount !== 0 && (
                        <>
                            <h1 className={styles.headingTitle}>
                                Thông báo
                                {` (${totalCount})`}
                            </h1>
                            <button onClick={clearAllNotificationHandler}>Xoá tất cả</button>
                        </>
                    )}
                </div>
                <div className={styles.notifications}>
                    {loading && <IonSpinner color="white" name="crescent" className="m-auto" />}
                    {!loading && notifications.length <= 0 && (
                        <div className={styles.emptyList}>
                            <h2>Hiện chưa có thông báo</h2>
                        </div>
                    )}
                    {!loading && notifications.length > 0 && (
                        <IonContent className={classNames([styles.content, 'no-scroll-bar'])}>
                            <div className={styles.notificationContainer}>
                                <div className={styles.notificationList}>
                                    {notifications.map((notification) => {
                                        return (
                                            <NotificationCmp
                                                loading={loader[notification.id]}
                                                key={notification.id}
                                                name={notification.data?.profileName || null}
                                                avatar={notification.data?.thumbnail || null}
                                                createdAt={notification.createdAt}
                                                content={notification.data?.content || undefined}
                                                type={notification.type}
                                                clickHandler={() =>
                                                    notificationHandler(
                                                        notification.id,
                                                        notification.type,
                                                        notification.data?.id,
                                                        notification.data?.profileId || undefined,
                                                        notification.data?.profileName || undefined,
                                                    )
                                                }
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                            <IonInfiniteScroll onIonInfinite={loadMoreData} threshold="100px" disabled={!isDataAvailable}>
                                <IonInfiniteScrollContent loadingSpinner="crescent" loadingText="Đang tải thêm thông báo..." />
                            </IonInfiniteScroll>
                        </IonContent>
                    )}
                </div>
            </PageContentCmp>
        </IonPage>
    );
};

export default NotificationPage;
