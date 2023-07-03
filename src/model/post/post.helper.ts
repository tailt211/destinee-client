import { convertImageRESPtoDTO } from '../image/image.helper';
import { PostOverallDTO } from './dto/post-overall.dto';
import { PostOverallRESP } from './response/post-overall.response';

export const convertRESPtoOverallDTO = (data: PostOverallRESP) =>
    ({
        id: data.id,
        image: convertImageRESPtoDTO(data.image),
        mentionCount: data.mentionCount,
        viewCount: data.viewCount,
        createdAt: data.createdAt,
    } as PostOverallDTO);
