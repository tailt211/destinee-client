import classNames from 'classnames';
import React from 'react';
import { Question } from './question';
import { QuestionAnswer } from './question-answer';
import { ResultAnswer } from './result-answer';
import { ResultProfile } from './result-profile';
import styles from './ResultAnswerCardCmp.module.scss';

type ResultAnswerCardCmpProps = {
    answer: ResultAnswer;
    questions: Question[];
    caller: ResultProfile;
    receiver: ResultProfile;
};

const ResultAnswerCardCmp: React.FC<ResultAnswerCardCmpProps> = ({ answer, questions, caller, receiver  }) => {
    const question: Question = questions.find(question => question.id === answer.questionId)!;
    const callerAnswer: QuestionAnswer = question.answers.find(_answer => _answer.id === answer.answers.caller.answerId)!;
    const receiverAnswer: QuestionAnswer = question.answers.find(_answer => _answer.id === answer.answers.receiver.answerId)!;
    const isSameAnswer: boolean = callerAnswer.id === receiverAnswer.id;

    return (
        <div className={classNames([styles.container, { [styles.sameResultDecorator]: isSameAnswer }])}>
            <p>{question.title}</p>
            <div className={styles.answerContainer}>
                {!isSameAnswer && (
                    <>
                        <div className={styles.answerRow}>
                            <img src={caller.avatar} alt="avatar" />
                            <span>{callerAnswer.title}</span>
                        </div>
                        <div className={styles.answerRow}>
                            <img src={receiver.avatar} alt="avatar" />
                            <span>{receiverAnswer.title}</span>
                        </div>
                    </>
                )}

                {callerAnswer.id === receiverAnswer.id && (
                    <>
                        <div className={styles.answerRow}>
                            <div className={styles.imgContainer}>
                                <img
                                    className={styles.above}
                                    src={caller.avatar}
                                    alt="avatar"
                                />
                                <img src={receiver.avatar} alt="avatar" />
                            </div>
                            <span>{callerAnswer.title}</span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ResultAnswerCardCmp;
