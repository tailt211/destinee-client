import { isEmpty, isUndefined, omitBy } from 'lodash';
import { destineeApi } from '../../https';
import { httpExceptionConverter } from '../../model/exception/http-exception.converter';
import { convertImageRESPtoDTO } from '../../model/image/image.helper';
import { ImageRESP } from '../../model/image/response/image-response';
import { MbtiConvertRESPToDTO } from '../../model/personality-test/mbti-convert-response-to-dto';
import { CallSettingDTO } from '../../model/profile/dto/profile-call-setting.dto';
import { ProfileDTO } from '../../model/profile/dto/profile.dto';
import { ProfileCallSettingUpdateRESP } from '../../model/profile/response/profile-call-setting-update.response';
import { PageSettingDTO } from '../../model/profile/dto/profile-page-setting.dto';
import { ProfilePageSettingUpdateRESP } from '../../model/profile/response/profile-page-setting-update.response';
import { ProfileRESP } from '../../model/profile/profile.response';
import { ProfileUpdateRESP } from '../../model/profile/response/profile-update.response';
import { DISPLAY_NAME_OPTION, GENDER, JOB, LANGUAGE, REGION, SEX } from '../../model/profile/profile.constant';
import { ProfileUpdateREQ } from '../../model/profile/request/profile-update.request';
import { ProfileCallSettingUpdateREQ } from '../../model/profile/request/profile-call-setting-update.request';
import { ProfilePageSettingUpdateREQ } from '../../model/profile/request/profile-page-setting-update.request';

export const fetchProfile = async (id: string) => {
    try {
        const data = (await destineeApi.get<ProfileRESP>(`/profiles/${id}`)).data;
        return {
            profile: {
                _id: data._id,
                name: data.name,
                nickname: data.nickname,
                username: data.username,
                personalInfo: {
                    birthdate: data.personalInfo.birthdate,
                    gender: data.personalInfo.gender ? GENDER.MALE : GENDER.FEMALE,
                    origin: REGION[data.personalInfo.origin],
                    sex: SEX[data.personalInfo.sex],
                    height: data.personalInfo.height,
                    hobbies: data.personalInfo.hobbies,
                    job: data.personalInfo.job && JOB[data.personalInfo.job],
                    languages: data.personalInfo.languages?.map((lang) => LANGUAGE[lang]),
                    major: data.personalInfo.major,
                    workAt: data.personalInfo.workAt,
                    favoriteSongs: data.personalInfo.favoriteSongs,
                    favoriteMovies: data.personalInfo.favoriteMovies,
                },
                callSetting: data.callSetting && {
                    displayName: DISPLAY_NAME_OPTION[data.callSetting.displayName],
                    age: data.callSetting.age,
                    height: data.callSetting.height,
                    hobbies: data.callSetting.hobbies,
                    jobStatus: data.callSetting.jobStatus,
                    languages: data.callSetting.languages,
                    origin: data.callSetting.origin,
                    sex: data.callSetting.sex,
                },
                profilePageSetting: data.profilePageSetting && {
                    displayName: DISPLAY_NAME_OPTION[data.profilePageSetting.displayName],
                    age: data.profilePageSetting.age,
                    height: data.profilePageSetting.height,
                    hobbies: data.profilePageSetting.hobbies,
                    jobStatus: data.profilePageSetting.jobStatus,
                    languages: data.profilePageSetting.languages,
                    origin: data.profilePageSetting.origin,
                    sex: data.profilePageSetting.sex,
                    bio: data.profilePageSetting.bio,
                },
                mbtiResult: MbtiConvertRESPToDTO(data.mbtiResult),
                disabled: data.disabled,
            } as ProfileDTO,
            avatarId: data.avatar?._id,
            callCountLeft: data.callCountLeft,
        };
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi fetch profile');
    }
};

export const fetchImage = async (id: string) => {
    try {
        const { data } = await destineeApi.get<ImageRESP>(`/images/single?id=${id}`);
        return convertImageRESPtoDTO(data);
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi fetch image');
    }
};

export const updateProfileInfo = async (profileId: string, body: ProfileUpdateREQ) => {
    try {
        const data = (await destineeApi.patch<ProfileUpdateRESP>(`/profiles/${profileId}`, body)).data;
        return omitBy(
            {
                name: data.name,
                nickname: data.nickname,
                username: data.username,
                personalInfo: omitBy(
                    {
                        birthdate: data.personalInfo.birthdate,
                        gender: data.personalInfo.gender ? GENDER.MALE : GENDER.FEMALE,
                        sex: data.personalInfo.sex && SEX[data.personalInfo.sex],
                        origin: data.personalInfo.origin && REGION[data.personalInfo.origin],
                        hobbies: data.personalInfo.hobbies,
                        languages: data.personalInfo.languages && data.personalInfo.languages?.map((lang) => LANGUAGE[lang]),
                        job: data.personalInfo.job && JOB[data.personalInfo.job],
                        workAt: data.personalInfo.workAt,
                        major: data.personalInfo.major,
                        height: data.personalInfo.height,
                    },
                    isUndefined,
                ),
            },
            isEmpty,
        ) as Partial<ProfileDTO>;
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi update profile');
    }
};

export const updateProfileCallSetting = async (profileId: string, body: ProfileCallSettingUpdateREQ) => {
    try {
        const data = (await destineeApi.patch<ProfileCallSettingUpdateRESP>(`/profiles/${profileId}/call-setting`, body))
            .data;
        return omitBy(
            {
                displayName: data.callSetting?.displayName && DISPLAY_NAME_OPTION[data.callSetting?.displayName],
                age: data.callSetting?.age,
                height: data.callSetting?.height,
                origin: data.callSetting?.origin,
                jobStatus: data.callSetting?.jobStatus,
                languages: data.callSetting?.languages,
                hobbies: data.callSetting?.hobbies,
                sex: data.callSetting?.sex,
            },
            isUndefined,
        ) as CallSettingDTO;
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi update profile call setting');
    }
};

export const updateProfilePageSetting = async (profileId: string, body: ProfilePageSettingUpdateREQ) => {
    try {
        const data = (
            await destineeApi.patch<ProfilePageSettingUpdateRESP>(`/profiles/${profileId}/profile-page-setting`, body)
        ).data;
        return omitBy(
            {
                displayName: data.profilePageSetting?.displayName && DISPLAY_NAME_OPTION[data.profilePageSetting?.displayName],
                age: data.profilePageSetting?.age,
                height: data.profilePageSetting?.height,
                origin: data.profilePageSetting?.origin,
                jobStatus: data.profilePageSetting?.jobStatus,
                languages: data.profilePageSetting?.languages,
                hobbies: data.profilePageSetting?.hobbies,
                sex: data.profilePageSetting?.sex,
                bio: data.profilePageSetting?.bio,
            },
            isUndefined,
        ) as PageSettingDTO;
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi update profile page setting');
    }
};

export const uploadProfileAvatar = async (profileId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
        const { data } = await destineeApi.post<ImageRESP>(`/profiles/${profileId}/upload-avatar`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return convertImageRESPtoDTO(data);
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi upload avatar');
    }
};
