import { DISPLAY_NAME_OPTION } from "../../model/profile/profile.constant";

export type CallInfoVisibility = {
    displayName?: DISPLAY_NAME_OPTION;
    displayAge?: boolean;
    displayOrigin?: boolean;
    displayJobStatus?: boolean;
    displayHeight?: boolean;
    displayLanguages?: boolean;
    displaySex?: boolean;
    displayHobbies?: boolean;
};
