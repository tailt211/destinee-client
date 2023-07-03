import { ImageRESP } from "../../image/response/image-response";
import { MbtiResultRESP } from "../../personality-test/response/mbti-result.response";

export interface FriendRESP {
    id: string;
    name: string;
    avatar?: ImageRESP;
    birthdate: string;
    origin: string;
    gender: boolean;
    job: string;
    workAt: string;
    major: string;
    hobbies: string[];
    height? : number;
    languages?: string[];
    bio?: string;
    mbtiResult: MbtiResultRESP | null;
    conversationId: string | null;
}