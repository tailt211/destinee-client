import { MbtiResultRESP } from "../../personality-test/response/mbti-result.response";

export interface FriendRequestRESP {
    id: string;
    createdAt: string;
    profileId: string;
    name: string;
    avatar: string;
    gender: boolean;
    mbtiResult: MbtiResultRESP | null;
    compatibility?: number;
}