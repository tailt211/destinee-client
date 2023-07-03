import { MbtiResultRESP } from "./mbti-result.response";

export interface PersonalityTestHistoryRESP {
    _id: string;
    createdAt: string;
    numberOfAnswers: number;
    processingState: string;
    result?: MbtiResultRESP;
};