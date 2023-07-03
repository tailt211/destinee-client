import { GENDER, JOB, LANGUAGE, REGION, SEX } from "../../profile/profile.constant";

export interface RegistrationAnswerDTO {
    name?: string;
    nickname?: string;
    origin?: REGION;
    gender?: GENDER;
    sex?: SEX;
    birthdate?: string;
    avatar?: string;
    /* Optional */
    job?: JOB | null;
    workAt?: string | null;
    major?: string | null;
    height?: number | null;
    languages?: LANGUAGE[] | null;
    hobbies?: string[] | null;
}
