import {
    IonContent,
    IonHeader,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonList,
    IonPage,
    IonSpinner,
} from '@ionic/react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PageContentCmp from '../../components/container/PageContentCmp';
import NotificationFriendRequestCmp from '../../components/notification/NotificationFriendRequestCmp';
import AvatarToolbarCmp from '../../components/toolbar/AvatarToolbarCmp';
import { AppDispatch, RootState } from '../../store';
import {
    fetchFriendRequestsThunk,
    loadMoreFriendRequestsThunk,
    verifyFriendRequestThunk,
} from '../../store/friend-request/friend-request.thunk';
import styles from './FriendRequestsPage.module.scss';

const FriendRequestsPage: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    /* State */
    const { loading, friendRequests, currentPage, isDataAvailable ,totalCount} = useSelector(
        (state: RootState) => state.friendRequest,
    );
    /* Effect */
    useEffect(() => {
        dispatch(fetchFriendRequestsThunk());
    }, [dispatch]);
    /* Handler */
    const loadMoreData = (e: any) => {
        if (!isDataAvailable) return;
        dispatch(loadMoreFriendRequestsThunk(currentPage + 1)).then(() =>
            e.target.complete()
        );
    };

    return (
        <IonPage className="destinee__bg">
            <IonHeader>
                <AvatarToolbarCmp />
            </IonHeader>
            <PageContentCmp
                scrollY={false}
                customStyle={{ height: '100%', paddingTop: 0 }}
                title={`Lời mời kết bạn
                        ${friendRequests.length !== 0 ? ` (${totalCount})` : ''}`}>
                <div className={styles.container}>
                    {loading && (
                        <IonSpinner color="white" name="crescent" className="m-auto" />
                    )}

                    {!loading && friendRequests.length > 0 && (
                        <IonContent className={styles.content}>
                            <IonList className={styles.list} lines="inset">
                                {friendRequests.map((friend, i) => {
                                    return (
                                        <NotificationFriendRequestCmp
                                            name={friend.name}
                                            key={friend.id}
                                            compatibility={friend.compatibility}
                                            mbtiType={friend.mbtiResult?.type || null}
                                            gender={friend.gender}
                                            onConfirm={() => {
                                                dispatch(
                                                    verifyFriendRequestThunk({
                                                        isAccept: true,
                                                        profileId: friend.profileId,
                                                    }),
                                                );
                                            }}
                                            onDelete={() => {
                                                dispatch(
                                                    verifyFriendRequestThunk({
                                                        isAccept: false,
                                                        profileId: friend.profileId,
                                                    }),
                                                );
                                            }}
                                            maxWidth="100%"
                                            avatar={friend.avatar}
                                        />
                                    );
                                })}
                            </IonList>
                            <IonInfiniteScroll
                                onIonInfinite={loadMoreData}
                                threshold="100px"
                                disabled={!isDataAvailable}>
                                <IonInfiniteScrollContent
                                    loadingSpinner="crescent"
                                    loadingText="Đang tải thêm lời mời..."/>
                            </IonInfiniteScroll>
                        </IonContent>
                    )}

                    {!loading && friendRequests.length <= 0 && (
                        <div className={styles.emptyList}>
                            <h2>Bạn chưa có lời mời kết bạn nào</h2>
                        </div>
                    )}
                </div>
            </PageContentCmp>
        </IonPage>
    );
};

export default FriendRequestsPage;
