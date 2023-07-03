import { IonButton } from '@ionic/react';
import classNames from 'classnames';
import { FC, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import ResultAnswerCardCmp from '../../components/call-result/ResultAnswerCardCmp';
import StatusMatchingCmp from '../../components/call-result/StatusMatchingCmp';
import { getPercentage } from '../../components/on-calling/on-calling.helper';
import useCall from '../../hooks/use-call';
import { getAvatar } from '../../model/image/image.helper';
import { TYPE_IMAGE } from '../../model/image/type-image.enum';
import { GENDER } from '../../model/profile/profile.constant';
import { PATHS } from '../../router/paths';
import { TAB_URL } from '../../router/tabs';
import { RootState } from '../../store';
import { CallState } from '../../store/call/call.slice';
import { ProfileState } from '../../store/profile/profile.slice';
import UIEffectContext from '../../store/UIEffectContext';
import styles from './CallResultPage.module.scss';

const getQuote: (matching: number) => { color: string; quote: string } = (matching) => {
    const percentage = getPercentage(matching);
    if (percentage <= 25)
        return {
            color: 'green',
            quote: 'Các cặp đôi trái dấu thường mang lại nhiều màu sắc cho nhau',
        };
    if (percentage >= 90)
        return {
            color: 'green',
            quote: 'Hai bạn là tri kỷ',
        };
    if (percentage >= 75)
        return {
            color: 'green',
            quote: 'Hai bạn đạt top 5% nhưng người hiểu nhau nhất',
        };
    if (percentage >= 50)
        return {
            color: 'green',
            quote: 'Hai bạn đã hiểu được một nửa của đối phương',
        };
    if (25 < percentage && percentage < 50)
        return {
            color: 'green',
            quote: 'Quan điểm không có đúng sai, chỉ có phù hợp hay không. Hãy trao đổi về câu trả lời của nhau',
        };
    return { color: '', quote: '' };
};

const CallResultPage: FC = () => {
    const { vibrate } = useContext(UIEffectContext);
    const history = useHistory();
    const [isCollapse, setIsCollapse] = useState<boolean>(false);
    const { isCalling, opponentInfo, isCallEnded, questionaire, questions } = useSelector(
        (state: RootState) => state.call,
    ) as CallState;
    const profile = useSelector((state: RootState) => state.profile) as ProfileState;
    const endCallRef = useRef<HTMLIonButtonElement>(null);
    const homeRef = useRef<HTMLIonButtonElement>(null);

    useCall(endCallRef, homeRef);

    /* Effects */
    useEffect(() => {
        if (!isCalling) history.push(`${TAB_URL}/${PATHS.HOME}`);
        if (isCallEnded) history.push(`/${PATHS.CALL_RATING}`);
        if (!questionaire.answers) history.push(`/${PATHS.CALL}/${PATHS.ON_CALLING}`);
    }, [history, isCalling, isCallEnded, questionaire.answers]);

    const onCollapseHandler = () => {
        vibrate('xs');
        setIsCollapse((prevState) => (prevState = !prevState));
        setTimeout(() => {
            history.replace(`/${PATHS.CALL}/${PATHS.ON_CALLING}`);
        }, 1000);
    };

    const callerAvatar = useMemo(() => {
        return getAvatar(profile.avatar, TYPE_IMAGE.SQUARE, profile.personalInfo.gender);
    }, [profile]);

    return (
        <>
            <IonButton routerLink={`/${PATHS.CALL_RATING}`} ref={endCallRef} className={'hidden'} />
            <IonButton routerLink={`${TAB_URL}/${PATHS.HOME}`} ref={homeRef} className={'hidden'} />
            <div className={styles.container}>
                <div className={classNames([styles.displayContainer, { [styles.collapseAnimate]: isCollapse }])}>
                    <span className={styles.shrinkBtn} onClick={onCollapseHandler}>
                        thu gọn
                    </span>

                    {opponentInfo && questionaire.answers && (
                        <>
                            <StatusMatchingCmp
                                callerAvatar={callerAvatar}
                                receiverName={opponentInfo.displayName}
                                receiverAvatar={getAvatar(
                                    opponentInfo.avatarUrl,
                                    TYPE_IMAGE.BLUR_RESIZED,
                                    opponentInfo.personalInfo.gender || GENDER.MALE,
                                )}
                                matchingPercentage={getPercentage(questionaire.matchingPercentage!)}
                                quote={getQuote(questionaire.matchingPercentage!).quote}
                                color={getQuote(questionaire.matchingPercentage!).color}
                            />

                            <div className={styles.answerContainer}>
                                {questionaire.answers.map((ans, idx) => {
                                    return (
                                        <ResultAnswerCardCmp
                                            answer={{
                                                questionId: ans.questionId,
                                                answers: {
                                                    caller: {
                                                        answerId: ans.yourAnswerId,
                                                    },
                                                    receiver: {
                                                        answerId: ans.opponentAnswerId,
                                                    },
                                                },
                                            }}
                                            key={idx}
                                            questions={questions!.map((q) => ({
                                                id: q.id,
                                                title: q.title,
                                                answers: q.answers.map((a) => ({
                                                    id: a.id,
                                                    title: a.title,
                                                })),
                                            }))}
                                            caller={{ avatar: callerAvatar }}
                                            receiver={{
                                                avatar: getAvatar(
                                                    opponentInfo.avatarUrl,
                                                    TYPE_IMAGE.BLUR_RESIZED,
                                                    opponentInfo.personalInfo.gender || GENDER.MALE,
                                                ),
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default CallResultPage;
