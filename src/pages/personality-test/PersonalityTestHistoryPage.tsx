import { IonAlert, IonButton, IonHeader, IonPage, IonSpinner } from '@ionic/react';
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import PageContentCmp from '../../components/container/PageContentCmp';
import InspectionResultCmp from '../../components/personality-test/InspectionResultCmp';
import TitleToolbarCmp from '../../components/toolbar/TitleToolbarCmp';
import { PersonalityTestCreateDTO } from '../../model/personality-test/dto/personality-test-create.dto';
import { PersonalityTestHistoryDTO } from '../../model/personality-test/dto/personality-test-history.dto';
import { mbtiQuestionsDisplayer } from '../../model/personality-test/mbti-questions-displayer';
import { mbtiTypeDisplayer } from '../../model/personality-test/mbti-type-displayer';
import { PERSONALITY_TEST_PROCESSING_STATE } from '../../model/personality-test/personality-test-processing-state.enum';
import { PATHS } from '../../router/paths';
import { AppDispatch, RootState } from '../../store';
import {
    PersonalityTestHistoryState,
    resetState as resetTestHistoryState,
} from '../../store/personality-test-history/personality-test-history.slice';
import { fetchPersonalityTestHistoriesThunk } from '../../store/personality-test-history/personality-test-history.thunk';
import { prepareTest } from '../../store/personality-test/personality-test.slice';
import { createPersonalityTestThunk } from '../../store/personality-test/personality-test.thunk';
import { ProfileState } from '../../store/profile/profile.slice';
import { convertToDateTime, getTimeSince } from '../../utils/time.helper';
import styles from './PersonalityTestHistoryPage.module.scss';

export const getQuestionLeft = (numberOfAnswers: number) => Object.keys(mbtiQuestionsDisplayer).length - numberOfAnswers;

const PersonalityTestHistoryPage: FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const history = useHistory();
    const [permissionAlert, setPermissionAlert] = useState<{
        title: string;
        yesOption: { title: string; handler: () => void };
        noOption: { title: string; handler: () => void };
    } | null>(null);
    const { loading, testHistories } = useSelector(
        (state: RootState) => state.personalityTestHistory,
    ) as PersonalityTestHistoryState;
    const { _id: profileId } = useSelector((state: RootState) => state.profile) as ProfileState;

    /* Effect */
    useEffect(() => {
        if (!profileId) return;
        dispatch(fetchPersonalityTestHistoriesThunk());
        return () => {
            dispatch(resetTestHistoryState());
        };
    }, [dispatch, profileId]);

    /* Handler */
    const openTestHandler = async (redirectUrl: string, testHistory: PersonalityTestHistoryDTO) => {
        await dispatch(
            prepareTest({
                id: testHistory.id,
                numberOfAnswers: testHistory.numberOfAnswers,
                processingState: testHistory.processingState,
            }),
        );
        history.push(redirectUrl);
    };

    const startNewTestHandler = async () => {
        const lastTest = testHistories[0];
        if (lastTest?.processingState === PERSONALITY_TEST_PROCESSING_STATE.NOT_READY)
            setPermissionAlert({
                title: `Bài kiểm tra cuối cùng vẫn còn ${getQuestionLeft(
                    lastTest.numberOfAnswers,
                )} câu hỏi dang dở. Bạn có muốn tiếp tục?`,
                yesOption: {
                    title: 'Tiếp tục',
                    handler: () => openTestHandler(`/${PATHS.PERSONALITY_TEST}/${lastTest.id}/processing`, lastTest),
                },
                noOption: {
                    title: 'Kiểm bài mới, loại bỏ tất cả bài cũ',
                    handler: async () => {
                        const { payload } = await dispatch(createPersonalityTestThunk());
                        history.push(`/${PATHS.PERSONALITY_TEST}/${(payload as PersonalityTestCreateDTO).id}/processing`);
                    },
                },
            });
        else if (lastTest?.processingState === PERSONALITY_TEST_PROCESSING_STATE.PENDING)
            setPermissionAlert({
                title: `Bài kiểm tra cuối cùng của bạn đã làm xong cách đây ${getTimeSince(
                    new Date(lastTest.createdAt),
                )} và đang chờ xử lý`,
                yesOption: {
                    title: 'Kiểm bài mới, loại bỏ bài này',
                    handler: async () => {
                        const { payload } = await dispatch(createPersonalityTestThunk());
                        history.push(`/${PATHS.PERSONALITY_TEST}/${(payload as PersonalityTestCreateDTO).id}/processing`);
                    },
                },
                noOption: {
                    title: 'Tôi sẽ chờ bài cũ',
                    handler: () => setPermissionAlert(null),
                },
            });
        else if (lastTest?.processingState === PERSONALITY_TEST_PROCESSING_STATE.SUCCEED) {
            const { payload } = await dispatch(createPersonalityTestThunk());
            history.push(`/${PATHS.PERSONALITY_TEST}/${(payload as PersonalityTestCreateDTO).id}/processing`);
        } else if (!lastTest) {
            const { payload } = await dispatch(createPersonalityTestThunk());
            history.push(`/${PATHS.PERSONALITY_TEST}/${(payload as PersonalityTestCreateDTO).id}/processing`);
        }
    };

    return (
        <IonPage className="grey__bg">
            <IonHeader>
                <TitleToolbarCmp title=''/>
            </IonHeader>
            <PageContentCmp scrollY={false}>
                <div className={styles.container}>
                    <div className={styles.contentContainer}>
                        <InspectionResultCmp />
                        <div className={styles.bodyContainer}>
                            <div className={styles.textContainer}>
                                <span>Lịch sử khảo sát</span>
                                <span>Kiểu tính cách</span>
                            </div>
                            <div className={styles.historyCardContainer}>
                                {loading && <IonSpinner color="white" name="crescent" className="m-auto" />}
                                {!loading && testHistories.length <= 0 && (
                                    <div className={styles.emptyList}>
                                        <h2>Bạn chưa thực hiện bài trắc nghiệm nào.</h2>
                                    </div>
                                )}
                                {!loading &&
                                    testHistories.length > 0 &&
                                    testHistories.map((history) => {
                                        let redirectUrl = `/${PATHS.PERSONALITY_TEST}/${history.id}`;
                                        if (history.processingState === PERSONALITY_TEST_PROCESSING_STATE.NOT_READY)
                                            redirectUrl += '/processing';
                                        return (
                                            <IonButton
                                                onClick={openTestHandler.bind(null, redirectUrl, history)}
                                                key={history.id}>
                                                <div className={styles.textCard}>
                                                    <span>{convertToDateTime(history.createdAt)}</span>
                                                    <h3>
                                                        {history.processingState === PERSONALITY_TEST_PROCESSING_STATE.SUCCEED &&
                                                            `${mbtiTypeDisplayer[history.result?.type!]} - ${history.result?.type}`}
                                                        {history.processingState === PERSONALITY_TEST_PROCESSING_STATE.PENDING &&
                                                            'Hệ thống đang tính toán'}
                                                        {history.processingState ===
                                                            PERSONALITY_TEST_PROCESSING_STATE.PROCESSING && 'Hệ thống đang xử lý'}
                                                        {history.processingState ===
                                                            PERSONALITY_TEST_PROCESSING_STATE.NOT_READY &&
                                                            `Cần thêm ${getQuestionLeft(history.numberOfAnswers)} câu trả
                                                            lời`}
                                                    </h3>
                                                </div>
                                            </IonButton>
                                        );
                                    })}
                            </div>
                        </div>
                    </div>
                    <IonAlert
                        cssClass="custom-alert"
                        isOpen={!!permissionAlert}
                        onDidDismiss={() => setPermissionAlert(null)}
                        header={permissionAlert?.title}
                        buttons={[
                            {
                                text: permissionAlert?.yesOption.title || '',
                                handler: permissionAlert?.yesOption.handler,
                            },
                            {
                                text: permissionAlert?.noOption.title || '',
                                handler: permissionAlert?.noOption.handler,
                            },
                        ]}
                    />
                    <button
                        onClick={startNewTestHandler}
                        style={
                            testHistories[0]?.processingState === PERSONALITY_TEST_PROCESSING_STATE.PROCESSING
                                ? {
                                      cursor: 'not-allowed',
                                      pointerEvents: 'none',
                                      opacity: '0.6',
                                  }
                                : undefined
                        }>
                        {testHistories[0]?.processingState === PERSONALITY_TEST_PROCESSING_STATE.PROCESSING
                            ? 'Đang đánh giá'
                            : 'Thực hiện trắc nghiệm'}
                    </button>
                </div>
            </PageContentCmp>
        </IonPage>
    );
};

export default PersonalityTestHistoryPage;
