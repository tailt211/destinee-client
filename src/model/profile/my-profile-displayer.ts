import moment from 'moment';
import { CallSettingDTO } from './dto/profile-call-setting.dto';
import { ProfileDTO } from './dto/profile.dto';
import { PageSettingDTO } from './dto/profile-page-setting.dto';
import { DISPLAY_NAME_OPTION } from './profile.constant';

export const myProfileDisplayer = (profile: ProfileDTO, setting: 'call-setting' | 'profile-page-setting') => {
    if (!profile || !profile.callSetting || !profile.profilePageSetting)
        throw new Error('Not enough information to display profile');
    const condition: PageSettingDTO | CallSettingDTO =
        setting === 'call-setting' ? profile.callSetting : profile.profilePageSetting;

    return {
        name: condition.displayName === DISPLAY_NAME_OPTION.DISPLAY_NAME ? profile.name : profile.nickname,
        gender: profile.personalInfo.gender,
        nickname: '',
        birthdate: condition.age ? moment(profile.personalInfo.birthdate).toDate() : undefined,
        avatar: profile.avatar,
        sex: condition.sex ? profile.personalInfo.sex : undefined,
        mbtiResult: profile.mbtiResult,
        /* Optional */
        height: condition.height ? profile.personalInfo.height : undefined,
        job: condition.jobStatus ? profile.personalInfo.job : undefined,
        workAt: condition.jobStatus ? profile.personalInfo.workAt : undefined,
        major: condition.jobStatus ? profile.personalInfo.major : undefined,
        origin: condition.origin ? profile.personalInfo.origin : undefined,
        languages: condition.languages ? profile.personalInfo.languages : undefined,
        hobbies: condition.hobbies ? profile.personalInfo.hobbies : undefined,
        bio: (condition as PageSettingDTO)?.bio,
    };
};
