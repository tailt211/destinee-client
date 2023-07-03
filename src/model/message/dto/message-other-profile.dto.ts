import { GENDER } from '../../profile/profile.constant';

export interface MessageOtherProfileDTO {
    id: string;
    avatar: string;
    name: string;
    gender: GENDER;
    disabled: boolean;
}
