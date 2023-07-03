import { IonContent, IonHeader, IonInfiniteScroll, IonInfiniteScrollContent, IonList, IonPage, IonSpinner } from '@ionic/react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import CallHistoryCardCmp from '../../components/call-history/CallHistoryCardCmp';
import PageContentCmp from '../../components/container/PageContentCmp';
import NotificationPremiumCmp from '../../components/notification/NotificationPremiumCmp';
import MainToolbarCmp from '../../components/toolbar/MainToolbarCmp';
import { AppDispatch, RootState } from '../../store';
import { CallHistoryState } from '../../store/call-history/call-history.slice';
import { loadMoreCallHistoryThunk } from '../../store/call-history/call-history.thunk';
import { HomeState } from '../../store/home/home.slice';
import styles from './CallHistoryPage.module.scss';

const CallHistoryPage: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    /* State */
    const { _id } = useSelector((state: RootState) => state.profile);
    const { loading, callHistories, isDataAvailable, currentPage } = useSelector(
        (state: RootState) => state.callHistory,
    ) as CallHistoryState;
    const { isBlockCallHistoryPage } = useSelector((state: RootState) => state.home) as HomeState;
    /* Handler */
    const loadMoreData = (e: any) => {
        if (!isDataAvailable) return;
        dispatch(loadMoreCallHistoryThunk({ id: _id, page: currentPage + 1 })).then(() => e.target.complete());
    };

    return (
        <IonPage className="destinee__bg">
            <IonHeader>
                <MainToolbarCmp />
            </IonHeader>
            <PageContentCmp tabOffset={true} title="Lịch sử cuộc gọi">
                {isBlockCallHistoryPage && <NotificationPremiumCmp />}
                <div className={styles.histories}>
                    {loading && <IonSpinner color="white" name="crescent" className="m-auto" />}
                    {!loading && callHistories.length <= 0 && (
                        <div className="emptyList">
                            <h2>Bạn chưa có cuộc gọi nào</h2>
                            <div className="line" />
                            <p>Gọi ngay ở trang chủ nào</p>
                        </div>
                    )}
                    {!loading && callHistories.length > 0 && (
                        <IonContent className={classNames([styles.content, 'no-scroll-bar'])}>
                            <IonList className={styles.list} lines="inset">
                                {callHistories.map((history) => {
                                    return (
                                        <CallHistoryCardCmp
                                            key={history.id}
                                            avatar={history.other.avatar}
                                            name={history.other.name}
                                            createdAt={history.createdAt}
                                            duration={history.duration}
                                            otherMbtiType={history.other.mbtiResult?.type || null}
                                            yourReviews={history.your.reviews}
                                            otherReviews={history.other.reviews}
                                            yourRate={history.your.rate}
                                            otherRate={history.other.rate}
                                            compatibility={history.compatibility}
                                            gender={history.other.gender}
                                            friendRequest={history.friendRequest}
                                            otherProfileId={history.other.id}
                                            conversationId={history.conversationId}
                                            disabled={history.other.disabled}
                                        />
                                    );
                                })}
                            </IonList>
                            <IonInfiniteScroll onIonInfinite={loadMoreData} threshold="100px" disabled={!isDataAvailable}>
                                <IonInfiniteScrollContent loadingSpinner="crescent" loadingText="Đang tải thêm cuộc gọi..." />
                            </IonInfiniteScroll>
                        </IonContent>
                    )}
                </div>
            </PageContentCmp>
        </IonPage>
    );
};

export default CallHistoryPage;
