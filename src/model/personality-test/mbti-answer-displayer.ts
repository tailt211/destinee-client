import { MBTI_ANSWER } from './mbti-answer.enum';

export const mbtiAnswerDisplayer: {
    [key in MBTI_ANSWER]: { title: string; backgroundColor: string };
} = {
    TOTAL_AGREE: { title: 'Rất chính xác', backgroundColor: '#43B794' },
    // QUITE_AGREE: { title: 'Khá chính xác', backgroundColor: 'rgba(67, 183, 148, 0.43)' },
    QUITE_AGREE: { title: 'Rất chính xác', backgroundColor: 'rgba(67, 183, 148, 0.43)' },
    AGREE: { title: 'Đúng', backgroundColor: 'rgba(67, 183, 148, 0.12)' },
    NEUTRAL: { title: 'Trung lập', backgroundColor: 'rgba(255, 255, 255, 0.07)' },
    DISAGREE: { title: 'Sai', backgroundColor: 'rgba(228, 73, 73, 0.12)' },
    QUITE_DISAGREE: { title: 'Hoàn toàn sai', backgroundColor: 'rgba(228, 73, 73, 0.41)' },
    // QUITE_DISAGREE: { title: 'Khá sai', backgroundColor: 'rgba(228, 73, 73, 0.41)' },
    TOTAL_DISAGREE: { title: 'Hoàn toàn sai', backgroundColor: '#E44949' },
};
