import { MbtiResultDTO } from "./personality-test/dto/mbti-result.dto";
import { GENDER, JOB, LANGUAGE, REGION, SEX } from "./profile/profile.constant";

export interface PersonalCallInfo {
    name?: string;
    gender?: GENDER;
    nickname?: string;
    origin?: REGION;
    birthdate?: Date;
    sex?: SEX;
    mbtiResult?: MbtiResultDTO | null;
    /* Optional */
    job?: JOB;
    workAt?: string;
    major?: string;
    height?: number;
    languages?: LANGUAGE[];
    hobbies?: string[];
}