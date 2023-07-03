import { IonHeader, IonPage } from '@ionic/react';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PageContentCmp from '../../components/container/PageContentCmp';
import InspectionResultCmp from '../../components/personality-test/InspectionResultCmp';
import TitleToolbarCmp from '../../components/toolbar/TitleToolbarCmp';
import { mbtiAnswerDisplayer } from '../../model/personality-test/mbti-answer-displayer';
import { mbtiQuestionsDisplayer } from '../../model/personality-test/mbti-questions-displayer';
import { ExtendedRouteProps } from '../../router/pages';
import { PATHS } from '../../router/paths';
import { AppDispatch, RootState } from '../../store';
import { PersonalityTestState, resetState } from '../../store/personality-test/personality-test.slice';
import { fetchPersonalityTestThunk } from '../../store/personality-test/personality-test.thunk';
import { ProfileState } from '../../store/profile/profile.slice';
import styles from './PersonalityTestPage.module.scss';

const PersonalityTestPage: FC<ExtendedRouteProps> = ({ match, history }) => {
    const dispatch: AppDispatch = useDispatch();
    
    /* State */
    const { answers } = useSelector((state: RootState) => state.personalityTest) as PersonalityTestState;
    const { _id: profileId } = useSelector((state: RootState) => state.profile) as ProfileState;

    /* Effect */
    useEffect(() => {
        if (!match.params.id) return;
        if (!profileId) return;
        dispatch(fetchPersonalityTestThunk(match.params.id)).then((payload: any) => {
            if (payload.error) history.replace(`/${PATHS.PERSONALITY_TEST}`);
        });
        return () => {
            dispatch(resetState());
        };
    }, [dispatch, match.params.id, profileId, history]);

    return (
        <IonPage className="grey__bg">
            <IonHeader>
                <TitleToolbarCmp title=""></TitleToolbarCmp>
            </IonHeader>
            <PageContentCmp scrollY={false}>
                <div className={styles.container}>
                    <InspectionResultCmp />
                    <div className={styles.bodyContainer}>
                        {answers.map((ans) => (
                            <div className={styles.cardContainer} key={ans.questionId}>
                                <span>
                                    {ans.questionId}. {mbtiQuestionsDisplayer[ans.questionId].vietnamese}
                                </span>
                                <div
                                    className={styles.cardBtn}
                                    style={{
                                        background: mbtiAnswerDisplayer[ans.answer].backgroundColor,
                                    }}>
                                    <h3>{mbtiAnswerDisplayer[ans.answer].title}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </PageContentCmp>
        </IonPage>
    );
};

export default PersonalityTestPage;
