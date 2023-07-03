export interface RegistrationRESP {
    id: string;
    name?: string;
    nickname?: string;
    origin?: string;
    birthdate?: string;
    gender?: boolean;
    sex?: string;
    avatar?: string;
    /* Optional */
    job?: string | null;
    workAt?: string | null;
    major?: string | null;
    height?: number | null;
    languages?: string[] | null;
    hobbies?: string[] | null;
    isFinished: boolean;
}
