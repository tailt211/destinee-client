import { createAsyncThunk } from '@reduxjs/toolkit';
import { ImageDTO } from '../../model/image/dto/image.dto';
import { CallSettingDTO } from '../../model/profile/dto/profile-call-setting.dto';
import { ProfileDTO } from '../../model/profile/dto/profile.dto';
import { PageSettingDTO } from '../../model/profile/dto/profile-page-setting.dto';
import { GENDER } from '../../model/profile/profile.constant';
import { setCallCountLeft } from '../home/home.slice';
import { setFilter } from '../queue/queue.slice';
import {
    fetchImage,
    fetchProfile,
    uploadProfileAvatar,
    updateProfileCallSetting,
    updateProfileInfo,
    updateProfilePageSetting,
} from './profile.service';
import { ProfileUpdateREQ } from '../../model/profile/request/profile-update.request';
import { ProfileCallSettingUpdateREQ } from '../../model/profile/request/profile-call-setting-update.request';
import { ProfilePageSettingUpdateREQ } from '../../model/profile/request/profile-page-setting-update.request';

export const fetchProfileThunk = createAsyncThunk<ProfileDTO, string, { rejectValue: string }>(
    'profile/fetch',
    async (id, { rejectWithValue, dispatch }) => {
        try {
            const { profile, avatarId, callCountLeft } = await fetchProfile(id);
            dispatch(setCallCountLeft(callCountLeft));
            dispatch(setFilter({ gender: profile.personalInfo.gender === GENDER.MALE ? GENDER.FEMALE : GENDER.MALE }));
            if (avatarId) dispatch(fetchAvatarThunk(avatarId));
            return profile;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);

export const updateProfileThunk = createAsyncThunk<
    Partial<ProfileDTO>,
    { id: string; body: ProfileUpdateREQ },
    { rejectValue: string }
>('profile/update', async ({ id, body }, { rejectWithValue }) => {
    try {
        return await updateProfileInfo(id, body);
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const updateProfileCallSettingThunk = createAsyncThunk<
    CallSettingDTO,
    { id: string; body: ProfileCallSettingUpdateREQ },
    { rejectValue: string }
>('profile/update-call-setting', async ({ id, body }, { rejectWithValue }) => {
    try {
        return await updateProfileCallSetting(id, body);
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const updateProfilePageSettingThunk = createAsyncThunk<
    PageSettingDTO,
    { id: string; body: ProfilePageSettingUpdateREQ },
    { rejectValue: string }
>('profile/update-page-setting', async ({ id, body }, { rejectWithValue }) => {
    try {
        return await updateProfilePageSetting(id, body);
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const fetchAvatarThunk = createAsyncThunk<ImageDTO, string, { rejectValue: string }>(
    'profile/fetch-avatar',
    async (id, { rejectWithValue }) => {
        try {
            return await fetchImage(id);
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);

export const uploadAvatarThunk = createAsyncThunk<ImageDTO, { file: File; profileId: string }, { rejectValue: string }>(
    'profile/upload-avatar',
    async ({ profileId, file }, { rejectWithValue }) => {
        try {
            return await uploadProfileAvatar(profileId, file);
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);
