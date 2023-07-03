export type ProfilePageSettingUpdateRESP = {
    profilePageSetting?: {
        displayName: string;
        age: boolean;
        height: boolean;
        origin: boolean;
        jobStatus: boolean;
        languages: boolean;
        hobbies: boolean;
        sex: boolean;
        bio?: string;
    };
};
