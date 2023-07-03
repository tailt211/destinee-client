import { MbtiResultDTO } from '../../personality-test/dto/mbti-result.dto';
import { GENDER } from '../../profile/profile.constant';

export interface FriendRequestDTO {
    id: string;
    profileId: string;
    name: string;
    avatar: string;
    gender: GENDER;
    mbtiResult: MbtiResultDTO | null;
    compatibility?: number;
    createdAt: string;
}
