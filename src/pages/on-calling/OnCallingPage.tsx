import { IonButton, IonIcon, useIonAlert } from '@ionic/react';
import { callOutline } from 'ionicons/icons';
import moment from 'moment';
import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import CardResultSuggestCmp from '../../components/on-calling/CardResultSuggestCmp';
import CardSuggestionCmp from '../../components/on-calling/CardSuggestionCmp';
import { getPercentage } from '../../components/on-calling/on-calling.helper';
import ProfileExpandCardCmp from '../../components/on-calling/ProfileExpandCardCmp';
import { FavoriteType } from '../../components/profile/FavoritesCmp';
import { favoriteMoviesDisplayer, favoriteSongsDisplayer } from '../../components/profile/profile-favorite.helper';
import useCall from '../../hooks/use-call';
import { getAvatar } from '../../model/image/image.helper';
import { TYPE_IMAGE } from '../../model/image/type-image.enum';
import { DISPLAY_NAME_OPTION, GENDER } from '../../model/profile/profile.constant';
import { PATHS } from '../../router/paths';
import { TAB_URL } from '../../router/tabs';
import { AppDispatch, RootState } from '../../store';
import { CallState, setMute } from '../../store/call/call.slice';
import { ProfileState } from '../../store/profile/profile.slice';
import SocketContext from '../../store/SocketContext';
import UIEffectContext from '../../store/UIEffectContext';
import { secondToTimerFormat } from '../../utils/formatter';
import styles from './OnCallingPage.module.scss';
import useOnCalling from './use-on-calling';

const OnCallingPage: React.FC = () => {
    const history = useHistory();
    const dispatch = useDispatch<AppDispatch>();
    const { endCall, requestQuestionaire } = useContext(SocketContext);
    const { clickFx } = useContext(UIEffectContext);
    const endCallRef = useRef<HTMLIonButtonElement>(null);
    const homeRef = useRef<HTMLIonButtonElement>(null);
    const [presentAlert] = useIonAlert();

    useCall(endCallRef, homeRef);
    const { hint, isChangeText } = useOnCalling();
    const { opponentInfo, questionaire, timer } = useSelector((state: RootState) => state.call) as CallState;
    const { callSetting, ...profile } = useSelector((state: RootState) => state.profile) as ProfileState;

    /* Setting */
    const yourFavorites: FavoriteType[] = [
        {
            title: 'Bài nhạc yêu thích',
            type: 'song',
            items: favoriteSongsDisplayer(profile.personalInfo.favoriteSongs),
        },
        {
            title: 'Bộ phim yêu thích nhất',
            type: 'movie',
            items: favoriteMoviesDisplayer(profile.personalInfo.favoriteMovies),
        },
    ];

    const otherFavorites: FavoriteType[] = [
        {
            title: 'Bài nhạc yêu thích',
            type: 'song',
            items: favoriteSongsDisplayer(opponentInfo?.personalInfo?.favoriteSongs),
        },
        {
            title: 'Bộ phim yêu thích nhất',
            type: 'movie',
            items: favoriteMoviesDisplayer(opponentInfo?.personalInfo?.favoriteMovies),
        },
    ];

    /* Handler */
    const stopCallingHandler = () => {
        clickFx();
        endCall();
    };
    const requestQuestionaireHandler = () => {
        clickFx();
        requestQuestionaire();
    };

    const showLeaveConfirm = useCallback(() => {
        window.history.pushState(null, '', window.location.pathname);
        history.goForward();
        presentAlert({
            backdropDismiss: false,
            header: 'Bạn có chắc muốn kết thúc cuộc gọi không?',
            buttons: [{ text: 'Đồng ý', handler: () => endCall() }, { text: 'Không đồng ý' }],
        });
    }, [history, endCall, presentAlert]);

    useEffect(() => {
        dispatch(setMute(false));
    }, [dispatch]);

    useEffect(() => {
        window.history.pushState(null, '', window.location.pathname);
        history.goForward();
        window.addEventListener('popstate', showLeaveConfirm);
        return () => {
            window.removeEventListener('popstate', showLeaveConfirm);
        };
    }, [history, showLeaveConfirm]);

    return (
        <>
            <IonButton routerLink={`/${PATHS.CALL_RATING}`} ref={endCallRef} className={'hidden'} />
            <IonButton routerLink={`${TAB_URL}/${PATHS.HOME}`} ref={homeRef} className={'hidden'} />
            <div className={styles.callingContainer}>
                <div className={styles.scrollDown}>
                    <ProfileExpandCardCmp
                        callInfo={{
                            name: callSetting.displayName === DISPLAY_NAME_OPTION.DISPLAY_NAME ? profile.name : profile.nickname,
                            gender: profile.personalInfo.gender,
                            birthdate: callSetting.age ? moment(profile.personalInfo.birthdate).toDate() : undefined,
                            sex: callSetting.sex ? profile.personalInfo.sex : undefined,
                            /* Optional */
                            height: callSetting.height ? profile.personalInfo.height : undefined,
                            job: callSetting.jobStatus ? profile.personalInfo.job : undefined,
                            workAt: callSetting.jobStatus ? profile.personalInfo.workAt : undefined,
                            major: callSetting.jobStatus ? profile.personalInfo.major : undefined,
                            origin: callSetting.origin ? profile.personalInfo.origin : undefined,
                            languages: callSetting.languages ? profile.personalInfo.languages : undefined,
                            hobbies: callSetting.hobbies ? profile.personalInfo.hobbies : undefined,
                            mbtiResult: profile.mbtiResult,
                        }}
                        avatar={getAvatar(profile.avatar, TYPE_IMAGE.BLUR_RESIZED, profile.personalInfo.gender)}
                        favorites={yourFavorites}
                        isScrollUp={false}
                    />
                </div>

                {!questionaire.answers && (
                    <div className={styles.suggestWrapper}>
                        <CardSuggestionCmp
                            textSuggest={hint.hint}
                            onCardClick={requestQuestionaireHandler}
                            highlight={hint.highlight}
                        />
                    </div>
                )}

                {questionaire.answers && opponentInfo && (
                    <CardResultSuggestCmp
                        isChange={isChangeText}
                        textSuggest="Giờ thì hãy hỏi đối phương lý do tại sao chọn câu trả lời như trên đi bạn yêu !"
                        myAvatar={getAvatar(profile.avatar, TYPE_IMAGE.SQUARE, profile.personalInfo.gender)}
                        otherAvatar={getAvatar(
                            opponentInfo.avatarUrl,
                            TYPE_IMAGE.BLUR_RESIZED,
                            opponentInfo.personalInfo.gender || GENDER.MALE,
                        )}
                        percentMatching={getPercentage(questionaire.matchingPercentage!)}
                    />
                )}

                {opponentInfo && (
                    <ProfileExpandCardCmp
                        callInfo={{
                            name: opponentInfo.displayName,
                            ...opponentInfo.personalInfo,
                            birthdate: opponentInfo.personalInfo.birthdate
                                ? moment(opponentInfo.personalInfo.birthdate).toDate()
                                : undefined,
                            mbtiResult: opponentInfo.mbtiResult,
                        }}
                        avatar={getAvatar(
                            opponentInfo.avatarUrl,
                            TYPE_IMAGE.BLUR_RESIZED,
                            opponentInfo.personalInfo.gender ? opponentInfo.personalInfo.gender : GENDER.MALE,
                        )}
                        favorites={otherFavorites}
                        isReverseLayout={true}
                        isScrollUp={true}
                    />
                )}

                <div className={styles.timeCalling}>
                    <p>{secondToTimerFormat(timer, true)}</p>
                    <div className={styles.stopCalling}>
                        <IonButton className={styles.stopCallingButton} onClick={stopCallingHandler}>
                            <IonIcon icon={callOutline}></IonIcon>
                        </IonButton>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OnCallingPage;
