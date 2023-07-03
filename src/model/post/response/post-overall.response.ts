import { ImageRESP } from "../../image/response/image-response";

export interface PostOverallRESP {
    id: string;
    image: ImageRESP;
    viewCount: number;
    mentionCount: number;
    createdAt: string;
}