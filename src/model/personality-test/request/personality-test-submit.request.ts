import { MBTI_ANSWER } from '../mbti-answer.enum';

export interface PersonalityTestSubmitREQ {
    questionId: number;
    answer: MBTI_ANSWER;
}
