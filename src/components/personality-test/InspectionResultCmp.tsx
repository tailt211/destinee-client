import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { mbtiTypeDisplayer } from '../../model/personality-test/mbti-type-displayer';
import { PERSONALITY_TEST_PROCESSING_STATE } from '../../model/personality-test/personality-test-processing-state.enum';
import { getQuestionLeft } from '../../pages/personality-test/PersonalityTestHistoryPage';
import { PATHS } from '../../router/paths';
import { RootState } from '../../store';
import { PersonalityTestHistoryState } from '../../store/personality-test-history/personality-test-history.slice';
import { ProfileState } from '../../store/profile/profile.slice';
import styles from './InspectionResultCmp.module.scss';

const InspectionResultCmp: FC = function () {
    const { testHistories } = useSelector((state: RootState) => state.personalityTestHistory) as PersonalityTestHistoryState;
    const { mbtiResult } = useSelector((state: RootState) => state.profile) as ProfileState;
    const [heading, setHeading] = useState<{
        title: string;
        description?: string;
        color?: string;
        mbtiCode?: string;
        mbtiType?: string;
    } | null>(null);

    /* Effect */
    useEffect(() => {
        const lastTest = testHistories[0];
        if (!lastTest)
            setHeading({
                title: 'Trắc nghiệm tính cách',
                color: '#43b794',
                description: 'Hãy giúp hệ thống hiểu thêm về bạn để gợi ý người phù hợp nhất với bạn',
            });
        else if (lastTest.processingState === PERSONALITY_TEST_PROCESSING_STATE.NOT_READY)
            setHeading({
                title: 'Trắc nghiệm tính cách',
                color: '#43b794',
                description: `Hãy làm tiếp ${getQuestionLeft(lastTest.numberOfAnswers)} câu hỏi còn dang dở`,
            });
        else if (lastTest.processingState === PERSONALITY_TEST_PROCESSING_STATE.PENDING)
            setHeading({
                title: 'Hệ thống đang đánh giá tính cách của bạn',
                color: '#927B66',
                description: 'Quá trình xử lý mất ít nhất vài giờ',
            });
        else if (lastTest.processingState === PERSONALITY_TEST_PROCESSING_STATE.SUCCEED)
            setHeading({
                title: 'Bạn là kiểu người',
                color: '#ffffff',
                mbtiType: mbtiTypeDisplayer[mbtiResult?.type!],
                mbtiCode: mbtiResult?.type,
            });
    }, [testHistories, mbtiResult]);

    return (
        <div className={styles.container}>
            <div className={styles.titleContainer}>
                <h1
                    style={{
                        color: `${heading?.color}`,
                    }}>
                    {heading?.title}
                </h1>
                {heading?.description && (<span>{heading?.description}</span>)}
                {heading?.mbtiType && (<p>{heading.mbtiType}</p>)}
                {heading?.mbtiCode && (<span>{heading.mbtiCode}</span>)}
            </div>
            {testHistories[0]?.processingState === PERSONALITY_TEST_PROCESSING_STATE.SUCCEED && (
                <NavLink className={styles.navLink} to={`/${PATHS.PERSONALITY_TEST_TYPE}`}>
                    Đọc thêm về tính cách của bạn
                </NavLink>
            )}
        </div>
    );
};

export default InspectionResultCmp;
