import { MBTI_ANSWER } from '../mbti-answer.enum';
import { PERSONALITY_TEST_PROCESSING_STATE } from '../personality-test-processing-state.enum';
import { MbtiResultDTO } from './mbti-result.dto';

export interface PersonalityTestDTO {
    id: string;
    createdAt: string;
    answers: {
        questionId: number;
        answer: MBTI_ANSWER;
    }[];
    numberOfAnswers: number;
    processingState: PERSONALITY_TEST_PROCESSING_STATE;
    result: MbtiResultDTO | null;
}
