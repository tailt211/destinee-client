import { REVIEW } from '../../call/review.enum';
import { FRIEND_REQUEST_STATUS } from '../../friend-request/friend-request-status.enum';
import { ImageDTO } from '../../image/dto/image.dto';
import { MbtiResultDTO } from '../../personality-test/dto/mbti-result.dto';
import { GENDER } from '../../profile/profile.constant';

export interface CallHistoryDTO {
    id: string;
    your: {
        rate?: number;
        reviews: REVIEW[];
    };
    other: {
        id: string;
        name: string;
        rate?: number;
        reviews: REVIEW[];
        avatar: string | ImageDTO | undefined;
        gender: GENDER;
        mbtiResult: MbtiResultDTO | null;
        disabled: boolean;
    };
    compatibility?: number;
    duration: number;
    createdAt: string;
    friendRequest: {
        requester: string;
        verifier: string;
        status: FRIEND_REQUEST_STATUS;
    } | null;
    conversationId?: string;
}
