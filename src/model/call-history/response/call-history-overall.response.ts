import { FRIEND_REQUEST_STATUS } from '../../friend-request/friend-request-status.enum';
import { MbtiResultRESP } from '../../personality-test/response/mbti-result.response';

export interface CallHistoryOverallRESP {
    id: string;
    your: {
        rate?: number;
        reviews: string[];
    };
    other: {
        id: string;
        name: string;
        rate?: number;
        reviews: string[];
        avatar: string;
        gender: boolean;
        mbtiResult: MbtiResultRESP | null;
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
