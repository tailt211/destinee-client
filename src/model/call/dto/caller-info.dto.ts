import { MbtiResultDTO } from "../../personality-test/dto/mbti-result.dto";
import { PersonalInfoDTO } from "../../profile/dto/profile-personal-info.dto";

export interface CallerInfoDTO {
    displayName: string;
    personalInfo: Partial<PersonalInfoDTO>;
    avatarUrl: string;
    mbtiResult: MbtiResultDTO | null;
}