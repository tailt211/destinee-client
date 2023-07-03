import { MBTI_CATEGORY } from "../mbti-category.enum";
import { MBTI_TYPE } from "../mbti-type.enum";

export interface MbtiResultDTO {
    type: MBTI_TYPE;
    category?: MBTI_CATEGORY;
}
