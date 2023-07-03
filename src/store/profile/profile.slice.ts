import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PersonalInfoDTO } from '../../model/profile/dto/profile-personal-info.dto';
import { ProfileDTO } from '../../model/profile/dto/profile.dto';
import { DISPLAY_NAME_OPTION, GENDER, JOB, LANGUAGE, REGION, SEX } from '../../model/profile/profile.constant';
import { PendingAction, RejectedAction } from '../store-type';
import {
    fetchAvatarThunk,
    fetchProfileThunk,
    updateProfileCallSettingThunk,
    updateProfilePageSettingThunk,
    updateProfileThunk,
    uploadAvatarThunk,
} from './profile.thunk';

export type ProfileState = {
    loading: boolean;
    updated?: boolean;
    error?: string;
} & ProfileDTO;

export const initialState: ProfileState = {
    loading: true,
    _id: '',
    name: 'Tên của bạn',
    nickname: 'Nickname của bạn',
    username: 'username.cua.ban',
    personalInfo: {
        birthdate: '2000-03-22T00:00:00.000Z',
        gender: GENDER.MALE,
        origin: REGION.HO_CHI_MINH,
        sex: SEX.STRAIGHT,
        height: 180,
        job: JOB.WORKER,
        languages: [LANGUAGE.VIETNAMESE, LANGUAGE.JAPANESE],
        hobbies: ['tennis', 'cafe phố'],
        major: 'gì đó',
        workAt: 'Công ty nào đó',
    },
    profilePageSetting: {
        displayName: DISPLAY_NAME_OPTION.DISPLAY_NAME,
        age: true,
        height: true,
        hobbies: true,
        jobStatus: true,
        languages: true,
        origin: true,
        sex: true,
        bio: '',
    },
    callSetting: {
        displayName: DISPLAY_NAME_OPTION.DISPLAY_NAME,
        age: true,
        height: true,
        hobbies: true,
        jobStatus: true,
        languages: true,
        origin: true,
        sex: true,
    },
    mbtiResult: null,
    disabled: false,
};

export const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = undefined;
        },
        clearUpdateNotification: (state) => {
            state.updated = undefined;
        },
        updateProfilePersonalInfo: (state, payload: PayloadAction<Partial<PersonalInfoDTO>>) => {
            state.personalInfo = {
                ...state.personalInfo,
                ...payload.payload,
            };
        },
        resetState: () => initialState,
    },
    extraReducers: (builder) => [
        builder.addCase(fetchProfileThunk.fulfilled, (state, { payload }) => ({
            loading: false,
            ...payload,
        })),
        builder.addCase(updateProfileThunk.fulfilled, (state, { payload }) => ({
            ...state,
            ...payload,
            personalInfo: {
                ...state.personalInfo,
                ...payload.personalInfo,
            },
            updated: true,
            loading: false,
        })),
        builder.addCase(updateProfileCallSettingThunk.fulfilled, (state, { payload }) => ({
            ...state,
            callSetting: payload,
            updated: true,
            loading: false,
        })),
        builder.addCase(updateProfilePageSettingThunk.fulfilled, (state, { payload }) => ({
            ...state,
            profilePageSetting: payload,
            updated: true,
            loading: false,
        })),
        builder.addCase(fetchAvatarThunk.fulfilled, (state, { payload }) => {
            state.avatar = payload;
            state.loading = false;
        }),
        builder.addCase(uploadAvatarThunk.fulfilled, (state, { payload }) => {
            state.avatar = payload;
            state.updated = true;
            state.loading = false;
        }),
        builder.addMatcher(
            (action): action is PendingAction => action.type.startsWith('profile/') && action.type.endsWith('/pending'),
            (state, action) => {
                state.loading = true;
            },
        ),
        builder.addMatcher(
            (action): action is RejectedAction => action.type.startsWith('profile/') && action.type.endsWith('/rejected'),
            (state, { payload }) => {
                state.loading = false;
                state.error = payload! as string;
            },
        ),
    ],
});

export const { clearError, resetState, updateProfilePersonalInfo, clearUpdateNotification } = profileSlice.actions;

export default profileSlice.reducer;
