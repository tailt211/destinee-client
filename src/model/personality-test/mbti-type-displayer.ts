import { MBTI_TYPE } from './mbti-type.enum';

export const mbtiTypeDisplayer: { [key in MBTI_TYPE]: string } = {
    INTJ: 'Người xây dựng',
    INTP: 'Nhà tư duy',
    ENTJ: 'Người lãnh đạo',
    ENTP: 'Người tranh luận',
    INFJ: 'Nhà bảo vệ',
    INFP: 'Người hoà giải',
    ENFJ: 'Người chủ xướng',
    ENFP: 'Người truyền cảm hứng',
    ISTJ: 'Nhà suy luận',
    ISFJ: 'Người bảo vệ',
    ESTJ: 'Người thực thi',
    ESFJ: 'Người quan tâm',
    ISTP: 'Thợ thủ công',
    ISFP: 'Người phiêu lưu',
    ESTP: 'Nhà kinh doanh',
    ESFP: 'Người trình diễn',
};
