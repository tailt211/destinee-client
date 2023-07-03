import { MbtiResultRESP } from './mbti-result.response';

export interface PersonalityTestRESP {
    _id: string;
    createdAt: string;
    answers: {
        questionId: number;
        answer: string;
    }[];
    numberOfAnswers: number;
    processingState: string;
    result?: MbtiResultRESP;
}
