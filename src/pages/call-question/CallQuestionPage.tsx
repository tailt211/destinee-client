import { IonButton, IonIcon, IonSpinner } from '@ionic/react';
import { callOutline } from 'ionicons/icons';
import { isEmpty } from 'lodash';
import { FC, useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import clockIcon from '../../assets/clock.png';
import QuestionListCmp from '../../components/call-question/QuestionListCmp';
import useCall from '../../hooks/use-call';
import { PATHS } from '../../router/paths';
import { TAB_URL } from '../../router/tabs';
import { AppDispatch, RootState } from '../../store';
import {
    CallQuestionState,
    decreaseTimer,
    initialState,
    nextQuestion,
    resetState as resetCallQuestionState,
    submitAnswer,
} from '../../store/call-question/call-question.slice';
import * as callQuestionThunk from '../../store/call-question/call-question.thunk';
import { CallState } from '../../store/call/call.slice';
import SocketContext from '../../store/SocketContext';
import UIEffectContext from '../../store/UIEffectContext';
import { secondToTimerFormat } from '../../utils/formatter';
import styles from './CallQuestionPage.module.scss';

const CallQuestionPage: FC = () => {
    const history = useHistory();
    const { endCall, submitAnswers } = useContext(SocketContext);
    const { timerLeftSfx, stopTimerLeft, bellDeskSfx, clickFx, vibrate } = useContext(UIEffectContext);
    const dispatch: AppDispatch = useDispatch();
    const questionListRef = useRef<HTMLButtonElement>(null);
    const endCallRef = useRef<HTMLIonButtonElement>(null);
    const homeRef = useRef<HTMLIonButtonElement>(null);
    useCall(endCallRef, homeRef);
    /* State */
    const { questionNo, currentQuestion, questions, timer, timerCounter, isQuestionJustRendered, timeLeft, answers } =
        useSelector((state: RootState) => state.callQuestion) as CallQuestionState;
    const { questionaire, timer: callTimer } = useSelector((state: RootState) => state.call) as CallState;
    const [timerSoundOn, setTimerSound] = useState(false);
    /* Effects */
    useEffect(() => {
        if (timer > 3 && timerSoundOn) {
            stopTimerLeft();
            setTimerSound(false);
        }
        else if(timer <= 3 && !timerSoundOn) {
            timerLeftSfx();
            setTimerSound(true);
        }
    }, [timer, timerSoundOn, stopTimerLeft, timerLeftSfx]);

    useEffect(() => {
        if (!questionaire.isAccepted) history.push(`/${PATHS.CALL}/${PATHS.ON_CALLING}`);
    }, [history, questionaire.isAccepted]);

    useEffect(() => {
        dispatch(callQuestionThunk.fetchQuestions());
        return () => {
            dispatch(resetCallQuestionState());
        };
    }, [dispatch]);

    useEffect(() => {
        if (isEmpty(questions)) return;
        const interval: NodeJS.Timeout = setInterval(() => {
            dispatch(decreaseTimer());
        }, 1000);

        return () => clearInterval(interval);
    }, [dispatch, questions, currentQuestion]);

    useEffect(() => {
        if (isEmpty(questions)) return;

        if (timerCounter === initialState.timerCounter && isQuestionJustRendered === false) questionListRef?.current?.click();
    }, [questions, timerCounter, isQuestionJustRendered]);

    useEffect(() => {
        if (!questionaire.answers) return;
        vibrate('lg');
        bellDeskSfx();
        history.replace(`/${PATHS.CALL}/${PATHS.CALL_RESULT}`);
    }, [questionaire.answers, history, bellDeskSfx, vibrate]);

    useEffect(() => {
        if (currentQuestion !== null || isQuestionJustRendered === true) return;
        submitAnswers({ answers });
    }, [answers, currentQuestion, questions, isQuestionJustRendered, submitAnswers]);

    /* Handler */
    const answerHandler = (answerId: string) => {
        dispatch(submitAnswer({ questionId: currentQuestion!.id, answerId }));
        stopTimerLeft();
        setTimerSound(false);
        dispatch(nextQuestion());
    };

    const onEndHandler = () => {
        clickFx();
        endCall();
    };

    return (
        <>
            <IonButton routerLink={`/${PATHS.CALL_RATING}`} ref={endCallRef} className={'hidden'} />
            <IonButton routerLink={`${TAB_URL}/${PATHS.HOME}`} ref={homeRef} className={'hidden'} />
            <div className={styles.container}>
                <div className={styles.voteContainer}>
                    {!isEmpty(questions) && (
                        <>
                            <div className={styles.questionHeader}>
                                <span className={styles.noWrap}>
                                    # {questionNo}/{questions.length}
                                </span>
                                <div className={styles.timerContainer}>
                                    <img src={clockIcon} alt="clock-icon" className={styles.clockIcon} />
                                    <span>
                                        {currentQuestion
                                            ? `Bạn còn ${timer} giây để trả lời`
                                            : `Còn ${timeLeft} giây để kết thúc`}
                                    </span>
                                </div>
                            </div>
                            <div className={styles.questionContainer}>
                                <div className={styles.line} />
                                <p>{currentQuestion ? currentQuestion.title : 'Bạn đã hoàn tất mọi câu hỏi của mình'}</p>
                                {currentQuestion && (
                                    <>
                                        <div className={styles.line} />
                                        <QuestionListCmp
                                            answers={currentQuestion?.answers}
                                            onAnswer={answerHandler}
                                            ref={questionListRef}
                                        />
                                    </>
                                )}

                                {!currentQuestion && (
                                    <span className={styles.waitingAnnounce}>
                                        Cùng chờ trong giây lát để đối phương hoàn thành phần câu hỏi nhé !
                                    </span>
                                )}
                            </div>
                        </>
                    )}

                    {isEmpty(questions) && <IonSpinner name="dots" color="white" />}
                </div>
                <div className={styles.footer}>
                    <p className={styles.textTime}>{secondToTimerFormat(callTimer, true)}</p>
                    <IonButton onClick={onEndHandler} size="small">
                        <IonIcon slot="icon-only" icon={callOutline} />
                    </IonButton>
                </div>
            </div>
        </>
    );
};

export default CallQuestionPage;
