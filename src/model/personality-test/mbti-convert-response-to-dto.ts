import { MbtiResultDTO } from './dto/mbti-result.dto';
import { MBTI_CATEGORY } from './mbti-category.enum';
import { MBTI_TYPE } from './mbti-type.enum';
import { MbtiResultRESP } from './response/mbti-result.response';

export const MbtiConvertRESPToDTO = (resp?: MbtiResultRESP | null) => {
    return resp
        ? ({
              type: MBTI_TYPE[resp.type],
              category: resp.category && MBTI_CATEGORY[resp.category],
          } as MbtiResultDTO)
        : null;
};
