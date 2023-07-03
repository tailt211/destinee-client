import { DISPLAY_NAME_OPTION } from "../profile.constant";

export type ProfilePageSettingUpdateREQ = {
    displayName?: DISPLAY_NAME_OPTION;
    age?: boolean;
    height?: boolean;
    origin?: boolean;
    jobStatus?: boolean;
    languages?: boolean;
    hobbies?: boolean;
    sex?: boolean;
    bio?: string | null;
};
