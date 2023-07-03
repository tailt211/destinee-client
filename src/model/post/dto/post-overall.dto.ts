import { ImageDTO } from "../../image/dto/image.dto";

export interface PostOverallDTO {
    id: string;
    image: ImageDTO;
    viewCount: number;
    mentionCount: number;
    createdAt: string;
}