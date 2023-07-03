import { ImageDTO } from "../../image/dto/image.dto";
import { MbtiResultDTO } from "../../personality-test/dto/mbti-result.dto";
import { CallSettingDTO } from "./profile-call-setting.dto";
import { PersonalInfoDTO } from "./profile-personal-info.dto";
import { PageSettingDTO } from "./profile-page-setting.dto";

export interface ProfileDTO {
    _id: string;
    name: string;
    nickname: string;
    username: string;
    avatar?: ImageDTO;
    personalInfo: PersonalInfoDTO;
    profilePageSetting: PageSettingDTO;
    callSetting: CallSettingDTO;
    mbtiResult: MbtiResultDTO | null;
    disabled: boolean;
}