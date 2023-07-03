import { MBTI_CATEGORY } from './mbti-category.enum';

export const mbtiCategoryDisplayer: { [key in MBTI_CATEGORY]: string } = {
    ANALYST: 'Nhà phân tích',
    DIPLOMAT: 'Nhà ngoại giao',
    SENTINEL: 'Nhà bảo vệ',
    EXPLORER: 'Nhà thám hiểm',
};
