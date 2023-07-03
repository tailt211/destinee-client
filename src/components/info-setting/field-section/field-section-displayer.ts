import { TOPIC } from '../../../model/call/topic.enum';
import { DISPLAY_NAME_OPTION, GENDER, JOB, LANGUAGE, REGION, SEX } from '../../../model/profile/profile.constant';

export const regionDisplayer: { [key in REGION]: string } = {
    MIDDLE_VIETNAM: 'miền trung',
    NORTH_VIETNAM: 'miền bắc',
    SOUTH_VIETNAM: 'miền nam',
    HO_CHI_MINH: 'TP hồ chí minh',
    HA_NOI: 'hà nội',
    BAC_NINH: 'bắc ninh',
    CAN_THO: 'cần thơ',
    KIEN_GIANG: 'kiên giang',
    QUANG_NGAI: 'quảng ngãi',
    TIEN_GIANG: 'tiền giang',
};

export const genderDisplayer: { [key in GENDER]: string } = {
    FEMALE: 'nữ',
    MALE: 'nam',
};

export const sexDisplayer: { [key in SEX]: string } = {
    STRAIGHT: 'thẳng',
    TOP: 'xu hướng top',
    BOT: 'xu hướng bot',
};

export const languageDisplayer: { [key in LANGUAGE]: string } = {
    ENGLISH: 'tiếng anh',
    FRENCH: 'tiếng pháp',
    GERMAN: 'tiếng đức',
    JAPANESE: 'tiếng nhật',
    VIETNAMESE: 'tiếng việt',
};

export const jobDisplayer: { [key in JOB]: string } = {
    STUDENT: 'sinh viên',
    SUPPORTER: 'nội trợ',
    WORKER: 'nhân viên',
};

export const displayNameDisplayer: { [key in DISPLAY_NAME_OPTION]: string } = {
    DISPLAY_NAME: 'tên',
    DISPLAY_NICKNAME: 'biệt danh',
};

export const topicDisplayer: { [key in TOPIC]: string } = {
    LOVE: 'tình yêu',
    SCHOOL: 'trường học',
    SHARE: 'tâm sự chia sẻ',
};
