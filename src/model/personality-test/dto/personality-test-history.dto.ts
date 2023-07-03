import { PERSONALITY_TEST_PROCESSING_STATE } from '../personality-test-processing-state.enum';
import { MbtiResultDTO } from './mbti-result.dto';

export interface PersonalityTestHistoryDTO {
    id: string;
    createdAt: string;
    numberOfAnswers: number;
    processingState: PERSONALITY_TEST_PROCESSING_STATE;
    result: MbtiResultDTO | null;
}
