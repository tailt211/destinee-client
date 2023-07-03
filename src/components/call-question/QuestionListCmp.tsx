import {
    IonButton,
    IonItem,
    IonLabel,
    IonList,
    IonRadio,
    IonRadioGroup,
} from '@ionic/react';
import React, {
    ForwardRefRenderFunction,
    useContext,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import UIEffectContext from '../../store/UIEffectContext';
import styles from './QuestionListCmp.module.scss';

type QuestionListCmpProps = {
    answers: { id: string; title: string }[];
    onAnswer: (answerId: string) => void;
};

const QuestionListCmp: ForwardRefRenderFunction<{}, QuestionListCmpProps> = (
    { answers, onAnswer },
    ref,
) => {
    const { vibrate } = useContext(UIEffectContext);
    const [answerId, setAnswerId] = useState<string>('');
    const btnRef = useRef<HTMLIonButtonElement>(null);
    const btnClick = () => btnRef?.current?.click();

    useImperativeHandle(ref, () => {
        return {
            click: btnClick,
        };
    });

    useEffect(() => {
        setAnswerId(answers[0].id);
    }, [answers]);

    const answerBtnClickHandler = () => {
        vibrate('xs');
        onAnswer(answerId);
    };

    return (
        <div className={styles.container}>
            <IonList lines="none">
                <IonRadioGroup
                    onIonChange={(e) => setAnswerId(e.detail.value)}
                    value={answerId}
                >
                    {answers.map((ans) => (
                        <IonItem key={ans.id}>
                            <IonLabel class="ion-text-wrap">
                                {ans.title}
                            </IonLabel>
                            <IonRadio
                                slot="start"
                                value={ans.id}
                                mode="md"
                                color="white"
                            />
                        </IonItem>
                    ))}
                </IonRadioGroup>
            </IonList>
            <IonButton onClick={answerBtnClickHandler} size="default" ref={btnRef}>
                Trả lời
            </IonButton>
        </div>
    );
};

export default React.forwardRef(QuestionListCmp);
