import { IonButton, IonHeader, IonPage, IonRippleEffect, IonSpinner, useIonAlert } from '@ionic/react';
import { RouteComponentProps, useHistory, useLocation } from 'react-router';
import PageContentCmp from '../../components/container/PageContentCmp';
import NotificationMatchingCmp, { NotificationMatching } from '../../components/profile/NotificationMatchingCmp';
import PublicInfoCmp from '../../components/profile/PublicInfoCmp';
import MainToolbarCmp from '../../components/toolbar/MainToolbarCmp';
import styles from './HomePage.module.scss';

import moment from 'moment';
import qs from 'qs';
import { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Transition } from 'react-transition-group';
import ModalContainerCmp from '../../components/container/ModalContainerCmp';
import CallTimeRangeModalCmp, { TimeRangeModalDestination } from '../../components/home/CallTimeRangeModalCmp';
import ModalPersonalityTestCpm from '../../components/modal-personality-test/ModalPersonalityTestCpm';
import useQueue from '../../hooks/use-queue';
import { getAvatar } from '../../model/image/image.helper';
import { TYPE_IMAGE } from '../../model/image/type-image.enum';
import { myProfileDisplayer } from '../../model/profile/my-profile-displayer';
import { GENDER } from '../../model/profile/profile.constant';
import { PATHS } from '../../router/paths';
import { TAB_URL } from '../../router/tabs';
import { AppDispatch, RootState } from '../../store';
import { HomeState } from '../../store/home/home.slice';
import { ProfileState } from '../../store/profile/profile.slice';
import { QueueState, setFilter } from '../../store/queue/queue.slice';
import UIEffectContext from '../../store/UIEffectContext';

const notificationList: NotificationMatching[] = [
    {
        userOne: 'jungtin854',
        userTwo: 'katuu',
        isMaleUserOne: true,
        isMaleUserTwo: false,
    },
    {
        userOne: 'king123',
        userTwo: 'queen456',
        isMaleUserOne: true,
        isMaleUserTwo: false,
    },
    {
        userOne: 'oldman1912',
        userTwo: 'noodle1401',
        isMaleUserOne: true,
        isMaleUserTwo: false,
    },
];

interface LocationProps {
    isPeronalityTest?: boolean;
}

const modalAnimationTiming = {
    enter: 3000,
    exit: 500,
};

const HomePage: React.FC<RouteComponentProps> = (props) => {
    const dispatch: AppDispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();
    const [presentAlert] = useIonAlert();
    const nodeRef = useRef();
    const { startQueue, setupQueue } = useQueue();
    const { clickFx, clickHardFx } = useContext(UIEffectContext);

    /* State */
    const [isPeronalityTest, setIsPersonalitytest] = useState<boolean | undefined>(false);
    const profile = useSelector((state: RootState) => state.profile) as ProfileState;
    const { loading: queueLoading } = useSelector((state: RootState) => state.queue) as QueueState;
    const { onlineUsers, callCountLeft, isLimitCall } = useSelector((state: RootState) => state.home) as HomeState;
    const isPeronalityTestProp = location.state ? (location.state as LocationProps).isPeronalityTest : false;
    const [isCallTimeModalOpen, setCallTimeModalOpen] = useState<TimeRangeModalDestination | null>(null);

    /* Effect */
    useEffect(() => {
        /* close modal when reload page */
        if (performance.navigation.type === 1) {
            history.replace({ pathname: '/tabs/home', state: undefined });
        }
    }, [history]);

    useEffect(() => {
        setIsPersonalitytest(isPeronalityTestProp);
    }, [location.state, isPeronalityTestProp]);

    useEffect(() => {
        const isJustRegistered = qs.parse(props.location.search, { ignoreQueryPrefix: true }).new;
        if (!isJustRegistered) return;
        presentAlert({
            backdropDismiss: false,
            header: 'Bắt đầu cuộc hành trình',
            message:
                'Hãy bắt đầu một cuộc gọi ngay, hệ thống sẽ chọn giúp bạn người phù hợp nhất. Sau khi trò chuyện, nếu cả hai thích nhau thì có thể tiếp tục nhắn tin, gọi điện. Và sau đó, nếu đã tin tưởng bạn có thể chia sẻ danh tính của mình cho người ấy bằng cách kết bạn',
            buttons: [
                {
                    text: 'Được rồi đi thôi',
                    role: 'cancel',
                },
            ],
        });
    }, [props.location.search, history, props.location.pathname, presentAlert]);

    /* Handler */
    const isNowCallTime = () => {
        const now = moment();
        const cmp =
            parseInt(process.env.REACT_APP_CALL_LIMIT_TO!.split(':').join('')) -
            parseInt(process.env.REACT_APP_CALL_LIMIT_FROM!.split(':').join(''));
        const bfCheck = now.isBefore(moment(process.env.REACT_APP_CALL_LIMIT_TO, 'hh:mm'));
        const aftCheck = now.isAfter(moment(process.env.REACT_APP_CALL_LIMIT_FROM, 'hh:mm'));
        return cmp >= 0 ? bfCheck && aftCheck : bfCheck || aftCheck;
    };
    const startAutoQueueHandler = async () => {
        if (isExceedQuota()) return;
        if (!isNowCallTime()) {
            clickFx();
            setCallTimeModalOpen('start');
            return;
        }
        clickHardFx();
        await dispatch(setFilter({ gender: profile.personalInfo.gender === GENDER.MALE ? GENDER.FEMALE : GENDER.MALE }));
        await startQueue();
    };

    const startQueueSetupHandler = async () => {
        if (isExceedQuota()) return;
        clickFx();
        if (!isNowCallTime()) {
            setCallTimeModalOpen('setup');
            return;
        }
        setupQueue();
    };

    const isExceedQuota = () => {
        clickFx();
        if (callCountLeft !== 0 || !isLimitCall) return false;
        presentAlert({
            backdropDismiss: true,
            header: 'Đã hết lượt gọi',
            message: 'Bạn đã dùng hết tất cả lượt gọi thoại trong ngày, hãy mua gói thành viên để gọi không giới hạn',
            buttons: [
                {
                    text: 'Tham khảo gói thành viên',
                    handler: () => {
                        history.push(`${TAB_URL}/${PATHS.CALL_HISTORY}`);
                    },
                },
                {
                    text: 'Để sau',
                    role: 'cancel',
                },
            ],
        });
        return true;
    };

    return (
        <IonPage className="destinee__bg">
            <IonHeader>
                <MainToolbarCmp />
            </IonHeader>
            <PageContentCmp tabOffset={true} scrollY={false}>
                <div className={`${styles.contentContainer}`}>
                    <div className={`${styles.infoDisplayerContainer}`}>
                        <h3>
                            Hiện tại đang có <span>{onlineUsers || '...'}</span> thành viên trực tuyến
                        </h3>
                        <PublicInfoCmp
                            callInfo={myProfileDisplayer(profile, 'call-setting')}
                            avatar={getAvatar(profile.avatar, TYPE_IMAGE.BLUR_RESIZED, profile.personalInfo.gender)}
                            isSkillColorize={true}
                        />
                        <NotificationMatchingCmp notificateList={notificationList} />
                    </div>

                    <div className={`${styles.callAction}`}>
                        <IonButton className={`${styles.manualMatch}`} onClick={startQueueSetupHandler}>
                            Tuỳ chỉnh cuộc gọi {isLimitCall && `(${callCountLeft})`}
                            <IonRippleEffect />
                        </IonButton>
                        <span>hoặc</span>
                        <IonButton onClick={startAutoQueueHandler} className={`${styles.autoMatch}`} disabled={queueLoading}>
                            {queueLoading && <IonSpinner color="white" name="crescent" className="m-auto" />}
                            {!queueLoading && `Bắt đầu gọi ngay${isLimitCall ? ` (${callCountLeft})` : ''}`}
                            <IonRippleEffect />
                        </IonButton>
                    </div>
                </div>
            </PageContentCmp>
            <ModalContainerCmp
                dialogPanelClasses="w-full"
                open={!!isCallTimeModalOpen}
                onClose={() => setCallTimeModalOpen(null)}>
                <CallTimeRangeModalCmp
                    closeModal={() => setCallTimeModalOpen(null)}
                    destination={isCallTimeModalOpen || 'setup'}
                />
            </ModalContainerCmp>
            <Transition in={isPeronalityTest} timeout={modalAnimationTiming} mountOnEnter unmountOnExit nodeRef={nodeRef}>
                {(state) => (
                    <ModalPersonalityTestCpm
                        customStyle={{
                            transition: 'opacity 3s ease-out',
                            opacity: state === 'entering' ? 0.5 : state === 'exiting' ? 0 : 1,
                        }}
                    />
                )}
            </Transition>
        </IonPage>
    );
};

export default HomePage;
