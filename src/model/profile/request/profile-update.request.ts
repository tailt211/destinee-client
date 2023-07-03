import { JOB, LANGUAGE, REGION, SEX } from '../profile.constant';

export type ProfileUpdateREQ = {
    name?: string;
    nickname?: string;
    username?: string;
    birthdate?: Date;
    origin?: REGION;
    gender?: boolean;
    sex?: SEX;
    languages?: LANGUAGE[];
    hobbies?: string[];
    job?: JOB | null;
    workAt?: string | null;
    major?: string | null;
    height?: number | null;
};
