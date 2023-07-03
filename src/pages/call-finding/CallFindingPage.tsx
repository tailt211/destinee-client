import { IonButton, IonHeader, IonPage, IonSpinner, useIonAlert, useIonToast } from '@ionic/react';
import classNames from 'classnames';
import moment from 'moment';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps, useHistory } from 'react-router-dom';

import CallFindingTimerCmp from '../../components/call-finding/CallFindingTimerCmp';
import ChoiceCriteriaCmp from '../../components/call-finding/ChoiceCriteriaCmp';
import OverHeightButton from '../../components/call-finding/ChoiceCriteriaOverHeightCmp';
import PageContentCmp from '../../components/container/PageContentCmp';
import {
    genderDisplayer,
    languageDisplayer,
    regionDisplayer,
    sexDisplayer,
    topicDisplayer,
} from '../../components/info-setting/field-section/field-section-displayer';
import { capitalizeValue } from '../../components/info-setting/field-section/field-section.helper';
import ProfileCardCmp from '../../components/profile/profile-card/ProfileCardCmp';
import AvatarToolbarCmp from '../../components/toolbar/AvatarToolbarCmp';
import { PersonalCallInfo } from '../../model/call-information';
import { getAvatar } from '../../model/image/image.helper';
import { TYPE_IMAGE } from '../../model/image/type-image.enum';
import { PATHS } from '../../router/paths';
import { TAB_URL } from '../../router/tabs';
import { AppDispatch, RootState } from '../../store';
import { CallState } from '../../store/call/call.slice';
import { ProfileState } from '../../store/profile/profile.slice';
import {
    customFilter,
    QueueState,
    resetState as resetQueueState,
    setQueueEmpty,
    stopFinding,
} from '../../store/queue/queue.slice';
import SocketContext from '../../store/SocketContext';
import UIEffectContext from '../../store/UIEffectContext';
import { getToast } from '../../utils/toast.helper';
import styles from './CallFindingPage.module.scss';

type RandomProfile = PersonalCallInfo & { avatar: string };

const CallFindingPage: React.FC<RouteComponentProps> = (props) => {
    const history = useHistory();
    const dispatch: AppDispatch = useDispatch();
    const { stopFindingCall, continueFindingCall } = useContext(SocketContext);
    const { clickFx, vibrate, swooshSoftSfx, queueSfx, stopQueueSfx, ringVibrateSfx, pingQuestionLongSfx, vibrateQueue, stopQueueVibrate } = useContext(UIEffectContext);
    const [present, dismiss] = useIonToast();
    const [presentAlert] = useIonAlert();
    const queueToaster = getToast('Tìm kiếm cuộc gọi', dismiss, 1500);
    /* Sound */

    /* State */
    const [randomProfile, setRandomProfile] = useState<RandomProfile>();
    const { isReady, isCalling } = useSelector((state: RootState) => state.call) as CallState;
    const {
        isQueueEmpty,
        randomProfiles,
        filter: queueFilter,
        suggestedFilter,
        continueToken,
        isFinding,
        loading: queueLoading,
        error: queueError,
    } = useSelector((state: RootState) => state.queue) as QueueState;
    const profile = useSelector((state: RootState) => state.profile) as ProfileState;
    /* Handler */
    const onStopHandler = useCallback(async () => {
        clickFx();
        await stopFindingCall();
        history.push(`${TAB_URL}/${PATHS.HOME}`);
        swooshSoftSfx();
    }, [history, stopFindingCall, clickFx, swooshSoftSfx]);
    /* Effect */
    useEffect(() => {
        window.history.pushState(null, "", window.location.pathname);
        history.goForward();
        window.addEventListener('popstate', onStopHandler);
        return () => {
            window.removeEventListener('popstate', onStopHandler);
        };
    }, [history, onStopHandler]);
    
    useEffect(() => {
        queueSfx();
        vibrateQueue();
        return () => {
            stopQueueSfx();
            stopQueueVibrate();
        };
    }, [queueSfx, stopQueueSfx, vibrateQueue, stopQueueVibrate]);

    useEffect(() => {
        if (!isReady || !isFinding) history.push(`${TAB_URL}/${PATHS.HOME}`);
        if (isCalling) {
            ringVibrateSfx();
            history.push(`/${PATHS.CALL}`);
        }
        return () => {
            dispatch(resetQueueState());
        };
    }, [history, isReady, isFinding, isCalling, ringVibrateSfx, dispatch]);

    useEffect(() => {
        if (!queueError || queueError !== 'QUEUE_INVALID_TOKEN') return;
        presentAlert({
            backdropDismiss: false,
            header: 'Thay đổi tiêu chí',
            message: 'Tiêu chí gợi ý không còn tác dụng do quá thời gian quy định, hãy lựa chọn tiêu chí lại',
            buttons: [
                {
                    text: 'Tôi hiểu rồi',
                    role: 'cancel',
                    handler: () => {
                        history.push(`/${PATHS.QUEUE_SETUP}`);
                        dispatch(stopFinding());
                    },
                },
            ],
        });
    }, [history, queueError, presentAlert, dispatch]);

    useEffect(() => {
        if (!isQueueEmpty) return;
        present(
            queueToaster('Hàng chờ hiện đang trống, cùng chờ thêm vài giây nữa nhé', 'success', undefined, () => {
                dispatch(setQueueEmpty(undefined));
            }),
        );
    }, [isQueueEmpty, present, queueToaster, dispatch]);

    useEffect(() => {
        if (!randomProfiles) return;

        let idx = 0;
        const _ = setInterval(() => {
            const rndProfile = randomProfiles[idx];
            setRandomProfile({
                avatar: rndProfile.avatarUrl,
                name: rndProfile.displayName,
                ...rndProfile.personalInfo,
                birthdate: rndProfile.personalInfo.birthdate ? moment(rndProfile.personalInfo.birthdate).toDate() : undefined,
                mbtiResult: rndProfile.mbtiResult,
            });
            if (idx === randomProfiles.length - 1) idx = 0;
            else idx++;
        }, 500);

        return () => clearInterval(_);
    }, [randomProfiles]);

    useEffect(() => {
        if (!suggestedFilter || !continueToken) return;
        let message = `Giới tính: ${capitalizeValue(genderDisplayer[suggestedFilter.gender], 'all-word')}, Độ tuổi: ${
            suggestedFilter.ageRange[0]
        } - ${suggestedFilter.ageRange[1]} tuổi`;
        if (suggestedFilter.origin)
            message += `, Quê quán: ${capitalizeValue(regionDisplayer[suggestedFilter.origin], 'all-word')}`;
        if (suggestedFilter.sex)
            message += `, Xu hướng tính dục: ${capitalizeValue(sexDisplayer[suggestedFilter.sex], 'all-word')}`;
        if (suggestedFilter.language)
            message += `, Ngôn ngữ: ${capitalizeValue(languageDisplayer[suggestedFilter.language], 'all-word')}`;
        if (suggestedFilter.topic) message += `, Chủ đề: ${capitalizeValue(topicDisplayer[suggestedFilter.topic], 'all-word')}`;

        pingQuestionLongSfx();
        vibrate(500);
        presentAlert({
            backdropDismiss: false,
            header: 'Gợi ý thay đổi tiêu chí',
            subHeader: 'Tiêu chí của bạn sẽ hơi khó để kiếm người trò chuyện lúc này, chúng tôi gợi ý bạn tiêu chí xu hướng nhé',
            message,
            buttons: [
                {
                    text: 'Đồng ý, sử dụng tiêu chí gợi ý',
                    handler: () => {
                        clickFx()
                        continueFindingCall(suggestedFilter, continueToken, false);
                    },
                },
                {
                    text: 'Giữ nguyên tiêu chí cũ',
                    handler: () => {
                        clickFx();
                        continueFindingCall(queueFilter, continueToken, true);
                    },
                },
                {
                    text: 'Tuỳ biến dựa trên tiêu chí gợi ý',
                    handler: async () => {
                        clickFx();
                        history.push(`/${PATHS.QUEUE_SETUP}`);
                        swooshSoftSfx();
                        await dispatch(customFilter(suggestedFilter));
                    },
                },
                {
                    text: 'Dừng tìm kiếm',
                    handler: async () => {
                        clickFx();
                        history.push(`${TAB_URL}/${PATHS.HOME}`);
                        swooshSoftSfx();
                    },
                },
            ],
        });
    }, [
        continueToken,
        history,
        queueFilter,
        suggestedFilter,
        clickFx,
        vibrate,
        swooshSoftSfx,
        pingQuestionLongSfx,
        onStopHandler,
        continueFindingCall,
        presentAlert,
        dispatch,
    ]);

    return (
        <IonPage
            className={classNames('destinee__bg', {
                hiddenAnimate: isCalling,
            })}>
            <IonHeader>
                <AvatarToolbarCmp isBackBtn={false} />
            </IonHeader>
            <PageContentCmp>
                <CallFindingTimerCmp />
                <div className={styles.profilesContainer}>
                    <ProfileCardCmp
                        callInfo={{
                            name: profile.name,
                            gender: profile.personalInfo.gender,
                            nickname: profile.nickname,
                            birthdate: moment(profile.personalInfo.birthdate).toDate(),
                            sex: profile.personalInfo.sex,
                            mbtiResult: profile.mbtiResult,
                            /* Optional */
                            height: profile.personalInfo.height,
                            job: profile.personalInfo.job,
                            workAt: profile.personalInfo.workAt,
                            major: profile.personalInfo.major,
                            origin: profile.personalInfo.origin,
                            languages: profile.personalInfo.languages,
                            hobbies: profile.personalInfo.hobbies,
                        }}
                        avatar={getAvatar(profile.avatar, TYPE_IMAGE.BLUR_RESIZED, profile.personalInfo.gender)}
                        setBlurBackground={true}
                        fixHeight={'186px'}
                        color={'white'}
                    />
                    <p className={styles.textMatching}>Hệ thống đang ghép cặp bạn với</p>
                    {randomProfile && (
                        <ProfileCardCmp
                            callInfo={randomProfile}
                            avatar={getAvatar(randomProfile.avatar, TYPE_IMAGE.BLUR_RESIZED, profile.personalInfo.gender)}
                            setBlurBackground={true}
                            isReverseLayout={true}
                            fixHeight={'186px'}
                            color={'white'}
                        />
                    )}
                </div>

                <div className={styles.line} />
                <div className={styles.critetiaContainer}>
                    <ChoiceCriteriaCmp filter={queueFilter} />
                </div>
                <OverHeightButton filter={queueFilter} />
                <div className={styles.stopButtonDiv}>
                    <IonButton expand="block" className={styles.stopButton} onClick={onStopHandler} disabled={queueLoading}>
                        {queueLoading && <IonSpinner color="white" name="crescent" className="m-auto" />}
                        {!queueLoading && 'Dừng'}
                    </IonButton>
                </div>
            </PageContentCmp>
        </IonPage>
    );
};

export default CallFindingPage;
