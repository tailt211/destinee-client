import { IonIcon, IonPage, IonSpinner } from '@ionic/react';
import classNames from 'classnames';
import { arrowRedo, arrowUndo } from 'ionicons/icons';
import { FC, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { mbtiAnswerDisplayer } from '../../model/personality-test/mbti-answer-displayer';
import { mbtiAnswers, MBTI_ANSWER } from '../../model/personality-test/mbti-answer.enum';
import { mbtiQuestionsDisplayer } from '../../model/personality-test/mbti-questions-displayer';
import { PERSONALITY_TEST_PROCESSING_STATE } from '../../model/personality-test/personality-test-processing-state.enum';
import { ExtendedRouteProps } from '../../router/pages';

import { PATHS } from '../../router/paths';
import { AppDispatch, RootState } from '../../store';
import {
    nextQuestion,
    PersonalityTestState,
    resetState as resetPersonalityTestState,
    setLoading,
    undoQuestion,
} from '../../store/personality-test/personality-test.slice';
import {
    fetchPersonalityTestThunk,
    submitAnswerThunk,
} from '../../store/personality-test/personality-test.thunk';
import { ProfileState } from '../../store/profile/profile.slice';
import { fetchProfileThunk } from '../../store/profile/profile.thunk';
import styles from './PersonalityTestProcessPage.module.scss';

const PersonalityTestProcessPage: FC<ExtendedRouteProps> = ({ match, history }) => {
    const dispatch = useDispatch<AppDispatch>();
    /* State */
    const noQuestionPerTest = process.env
        .REACT_APP_PERSONALITY_TEST_QUESTION_LIMIT
        ? Number.parseInt(process.env.REACT_APP_PERSONALITY_TEST_QUESTION_LIMIT)
        : 20;
    const {
        id,
        loading,
        submitting,
        noAnswered,
        answers,
        currentIndex,
        processingState,
    } = useSelector((state: RootState) => state.personalityTest) as PersonalityTestState;
    const { _id: profileId } = useSelector(
        (state: RootState) => state.profile,
    ) as ProfileState;
    const [askToContinue, setAskToContinue] = useState(false);

    const totalNumberOfQuestion = useMemo(
        () => Object.keys(mbtiQuestionsDisplayer).length,
        [],
    );
    const progress = useMemo(
        () => Math.ceil((noAnswered / totalNumberOfQuestion) * 100),
        [noAnswered, totalNumberOfQuestion],
    );

    const isFinished = useMemo(
        () => noAnswered === totalNumberOfQuestion,
        [noAnswered, totalNumberOfQuestion],
    );

    /* Handler */
    const undoHandler = () => {
        dispatch(undoQuestion());
    };
    const nextHandler = () => {
        dispatch(nextQuestion());
    };
    const submitHandler = (answer: MBTI_ANSWER) => {
        dispatch(
            submitAnswerThunk({
                id: id!,
                body: { questionId: currentIndex + 1, answer },
            }),
        );
    };
    const continueHandler = () => {
        if (askToContinue) {
            setAskToContinue(false);
            return;
        }
        // Đã hoàn thành
        dispatch(resetPersonalityTestState());
        dispatch(fetchProfileThunk(profileId));
        history.replace(`/${PATHS.PERSONALITY_TEST}`);
    };
    const doLaterHandler = () => {
        dispatch(resetPersonalityTestState());
        history.replace(`/${PATHS.PERSONALITY_TEST}`);
    };

    /* Effect */
    useEffect(() => {
        if (!match.params.id) return;
        if (!profileId) {
            dispatch(setLoading(true));
            return;
        }
        dispatch(fetchPersonalityTestThunk(match.params.id)).then((payload: any) => {
            if (payload.error) history.replace(`/${PATHS.PERSONALITY_TEST}`);
        });
    }, [dispatch, match.params.id, profileId, history]);

    useEffect(() => {
        if (
            processingState &&
            processingState !== PERSONALITY_TEST_PROCESSING_STATE.NOT_READY
        )
            history.push(`/${PATHS.PERSONALITY_TEST}/${id}`);
    }, [processingState, id, history]);

    useEffect(() => {
        if (
            noAnswered % noQuestionPerTest === 0 &&
            noAnswered !== 0 &&
            noAnswered !== totalNumberOfQuestion
        )
            setAskToContinue(true);
    }, [setAskToContinue, noAnswered, totalNumberOfQuestion, noQuestionPerTest]);

    return (
        <IonPage className="grey__bg">
            <div className={styles.container}>
                {loading && (
                    <IonSpinner color="white" name="crescent" className="m-auto" />
                )}
                {!loading && (
                    <>
                        <div className={styles.progressBarContainer}>
                            <div className={styles.progressBar}>
                                <div
                                    className={styles.progress}
                                    style={{
                                        width: `${progress}%`,
                                    }}
                                />
                            </div>
                            <span>
                                {!askToContinue &&
                                    !isFinished &&
                                    `Câu ${currentIndex + 1} - `}
                                Đã hoàn thành {noAnswered}/{totalNumberOfQuestion} câu
                            </span>
                        </div>
                        {!askToContinue && !isFinished && (
                            <div className={styles.contentContainer}>
                                <div className={styles.headerTitle}>
                                    {mbtiQuestionsDisplayer[currentIndex + 1]?.vietnamese}
                                </div>
                                <div className={styles.actionContainer}>
                                    <div className={styles.actionBtnContainer}>
                                        {mbtiAnswers.map((answer) => (
                                            <button
                                                disabled={submitting}
                                                key={answer}
                                                onClick={submitHandler.bind(null, answer)}
                                                className={classNames({
                                                    [styles.choosen]:
                                                        answer ===
                                                        answers[currentIndex]?.answer,
                                                })}
                                                style={{
                                                    background:
                                                        mbtiAnswerDisplayer[answer]
                                                            .backgroundColor,
                                                }}>
                                                {mbtiAnswerDisplayer[answer].title}
                                            </button>
                                        ))}
                                    </div>
                                    <div className={styles.positionBtnContainer}>
                                        {currentIndex > 0 && (
                                            <button onClick={undoHandler}>
                                                <IonIcon icon={arrowUndo} /> Hoàn tác
                                            </button>
                                        )}
                                        {currentIndex < noAnswered && (
                                            <button onClick={nextHandler}>
                                                Tiếp tục <IonIcon icon={arrowRedo} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        {(askToContinue || isFinished) && (
                            <div className={styles.completionAnnounceContainer}>
                                <p>
                                    {askToContinue
                                        ? `Bạn vừa hoàn thành ${noAnswered} câu hỏi trắc nghiệm`
                                        : 'Bạn đã hoàn thành toàn bộ câu hỏi trắc nghiệm'}
                                </p>
                                <div className={styles.actionContainer}>
                                    <button onClick={continueHandler}>
                                        {askToContinue ? 'Tiếp tục' : 'Hoàn thành'}
                                    </button>
                                    {askToContinue && (
                                        // eslint-disable-next-line jsx-a11y/anchor-is-valid
                                        <a
                                            href={void 0}
                                            onClick={doLaterHandler.bind(null)}>
                                            Làm sau
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </IonPage>
    );
};

export default PersonalityTestProcessPage;
