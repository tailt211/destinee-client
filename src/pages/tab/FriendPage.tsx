import {
    IonContent,
    IonHeader,
    IonIcon,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonPage,
    IonSpinner,
    useIonToast,
} from '@ionic/react';
import classNames from 'classnames';
import { searchSharp } from 'ionicons/icons';
import { isString } from 'lodash';
import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ModalContainerCmp from '../../components/container/ModalContainerCmp';
import PageContentCmp from '../../components/container/PageContentCmp';
import FriendCardCmp from '../../components/friend/FriendCardCmp';
import FriendRequestCmp from '../../components/friend/FriendRequestCmp';
import NotificationFriendRequestCmp from '../../components/notification/NotificationFriendRequestCmp';
import NotificationPremiumCmp from '../../components/notification/NotificationPremiumCmp';
import MainToolbarCmp from '../../components/toolbar/MainToolbarCmp';
import { getAvatar } from '../../model/image/image.helper';
import { TYPE_IMAGE } from '../../model/image/type-image.enum';
import { MBTI_TYPE } from '../../model/personality-test/mbti-type.enum';
import { GENDER } from '../../model/profile/profile.constant';
import { PATHS } from '../../router/paths';
import { AppDispatch, RootState } from '../../store';
import { verifyFriendRequestThunk } from '../../store/friend-request/friend-request.thunk';
import { FriendState } from '../../store/friend/friend.slice';
import { fetchFriendsThunk, loadMoreFriendsThunk } from '../../store/friend/friend.thunk';
import { HomeState } from '../../store/home/home.slice';
import { getToast } from '../../utils/toast.helper';
import styles from './FriendPage.module.scss';

const FriendPage: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    /* State */
    const { loading, friendRequests, totalCount } = useSelector((state: RootState) => state.friendRequest);
    const { isBlockFriendPage } = useSelector((state: RootState) => state.home) as HomeState;

    const [search, setSearch] = useState<string>();
    const [modal, setModal] = useState<{
        id: string;
        name: string;
        avatar: string;
        compatibility?: number;
        mbtiType: MBTI_TYPE | null;
        gender: GENDER;
    } | null>(null);
    const { token } = useSelector((state: RootState) => state.auth);
    const {
        loading: friendsLoading,
        friends,
        isDataAvailable,
        currentPage,
        totalCount: totalFriendCount,
    } = useSelector((state: RootState) => state.friend) as FriendState;

    /* Toast */
    const [present, dismiss] = useIonToast();
    const friendRequestToaster = getToast('Lời mời kết bạn', dismiss, 2000);

    let filterTimeout: NodeJS.Timeout | undefined;
    const searchHandler = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const search = e.target.value;
        clearTimeout(filterTimeout);

        filterTimeout = setTimeout(() => {
            setSearch(search);
        }, 700);
    };

    const loadMoreData = (e: any) => {
        if (!isDataAvailable) return;
        dispatch(loadMoreFriendsThunk({ search: search, page: currentPage + 1 })).then(() => e.target.complete());
    };

    /* Effect */
    useEffect(() => {
        if (!isString(search) || !token) return;
        dispatch(fetchFriendsThunk(search));
    }, [dispatch, search, token]);

    return (
        <IonPage className="destinee__bg">
            <IonHeader>
                <MainToolbarCmp></MainToolbarCmp>
            </IonHeader>
            <PageContentCmp tabOffset={true}>
                <ModalContainerCmp open={modal !== null} onClose={() => setModal(null)}>
                    {modal !== null && (
                        <NotificationFriendRequestCmp
                            name={modal.name}
                            avatar={getAvatar(modal.avatar, TYPE_IMAGE.BLUR_RESIZED, modal.gender)}
                            compatibility={modal.compatibility}
                            mbtiType={modal.mbtiType}
                            gender={modal.gender}
                            onConfirm={() => {
                                dispatch(
                                    verifyFriendRequestThunk({
                                        isAccept: true,
                                        profileId: modal.id,
                                    }),
                                );
                                setModal(null);
                                present(friendRequestToaster(`Bạn & ${modal.name} đã trở thành bạn bè`, 'success'));
                            }}
                            onDelete={() => {
                                dispatch(
                                    verifyFriendRequestThunk({
                                        isAccept: false,
                                        profileId: modal.id,
                                    }),
                                );
                                setModal(null);
                            }}
                        />
                    )}
                </ModalContainerCmp>
                <div className={styles.friendPage}>
                    <IonContent
                        scroll-y={isBlockFriendPage ? 'false' : 'true'}
                        className={classNames([styles.IonContent, 'no-scroll-bar'])}>
                        <div className={classNames([styles.container, { [styles.isLockScrollFriend]: isBlockFriendPage }])}>
                            {friendRequests.length !== 0 && (
                                <div className={classNames([styles.sectionContainer, styles.friendRequestContainer])}>
                                    <div className={styles.titleContainer}>
                                        {loading && <IonSpinner color="white" name="crescent" className="m-auto" />}
                                        {!loading && friendRequests.length !== 0 && (
                                            <>
                                                <h1 className={styles.headingTitle}>
                                                    Lời mời kết bạn
                                                    {` (${totalCount})`}
                                                </h1>
                                                <Link to={`/${PATHS.FRIEND_REQUEST}`} className={styles.link}>
                                                    Xem tất cả
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                    <div className={styles.notificationContainer}>
                                        {friendRequests.map((request, i) => {
                                            if (i >= 2) return null;
                                            return (
                                                <FriendRequestCmp
                                                    key={request.id}
                                                    avatar={getAvatar(request.avatar, TYPE_IMAGE.BLUR_RESIZED, request.gender)}
                                                    name={request.name}
                                                    onClick={() =>
                                                        setModal({
                                                            id: request.profileId,
                                                            name: request.name,
                                                            avatar: getAvatar(
                                                                request.avatar,
                                                                TYPE_IMAGE.BLUR_RESIZED,
                                                                request.gender,
                                                            ),
                                                            mbtiType: request.mbtiResult?.type || null,
                                                            compatibility: request.compatibility,
                                                            gender: request.gender,
                                                        })
                                                    }
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className={classNames([styles.sectionContainer, styles.friendContainer])}>
                                <h1 className={styles.headingTitle}>
                                    Bạn bè
                                    {totalFriendCount !== 0 ? ` (${totalFriendCount})` : ''}
                                </h1>
                                <div className={styles.unlockLayoutContainer}>
                                    {isBlockFriendPage && (
                                        <NotificationPremiumCmp customStyle={{ justifyContent: 'flex-start', gap: '50px' }} />
                                    )}
                                    <div
                                        className={classNames([
                                            styles.searchContainer,
                                            { [styles.disabledSearch]: friendsLoading || totalFriendCount === 0 },
                                        ])}>
                                        <input
                                            className={styles.search}
                                            onChange={(e) => searchHandler(e)}
                                            placeholder="Tìm kiếm"
                                            disabled={friendsLoading || totalFriendCount === 0}
                                        />
                                        <IonIcon className={styles.icon} icon={searchSharp} />
                                    </div>

                                    {friendsLoading && <IonSpinner color="white" name="crescent" className="m-auto" />}
                                    {!friendsLoading && friends.length <= 0 && (
                                        <div className={styles.emptyList}>
                                            <h2>
                                                {totalFriendCount === 0
                                                    ? 'Bạn chưa kết bạn với ai cả'
                                                    : 'Không có kết quả phù hợp với từ khoá tìm kiếm'}
                                            </h2>
                                        </div>
                                    )}
                                    {!friendsLoading && friends.length > 0 && (
                                        <div className={styles.containerFriendList}>
                                            <div className={styles.friendList}>
                                                {friends.map((friend) => (
                                                    <FriendCardCmp
                                                        key={friend.id}
                                                        id={friend.id}
                                                        name={friend.name}
                                                        avatar={getAvatar(friend.avatar, TYPE_IMAGE.SQUARE, friend.gender)}
                                                        birthdate={friend.birthdate}
                                                        gender={friend.gender}
                                                        hobbies={friend.hobbies}
                                                        job={friend.job}
                                                        major={friend.major}
                                                        origin={friend.origin}
                                                        workAt={friend.workAt}
                                                        mbtiResult={friend.mbtiResult}
                                                    />
                                                ))}
                                            </div>
                                            <IonInfiniteScroll
                                                onIonInfinite={loadMoreData}
                                                threshold="100px"
                                                disabled={!isDataAvailable}>
                                                <IonInfiniteScrollContent
                                                    loadingSpinner="crescent"
                                                    loadingText="Đang tải thêm bạn bè..."
                                                />
                                            </IonInfiniteScroll>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </IonContent>
                </div>
            </PageContentCmp>
        </IonPage>
    );
};

export default FriendPage;
