export type ProfileUpdateRESP = {
    name?: string;
    nickname?: string;
    username?: string;
    personalInfo: {
        birthdate?: string;
        origin?: string;
        gender?: boolean;
        sex?: string;
        languages?: string[];
        hobbies?: string[];
        job?: string;
        workAt?: string;
        major?: string;
        height?: number;
    };
};
