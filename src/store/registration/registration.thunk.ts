import { createAsyncThunk } from '@reduxjs/toolkit';
import { getToken } from 'firebase/messaging';
import { RootState } from '..';
import { messaging } from '../../firebase';
import { RegistrationAnswerDTO } from '../../model/registration/dto/registration-answer.dto';
import { RegistrationRegisterREQ } from '../../model/registration/request/registration-register.request';
import { RegistrationSubmitREQ } from '../../model/registration/request/registration-submit.request';
import { RegistrationImageUploadRESP } from '../../model/registration/response/registration-image-upload.response';
import { RegistrationOverallRESP } from '../../model/registration/response/registration-overall.response';
import { AccountState } from '../account/account.slice';
import { addRegistrationToken, getLocalStorageRegistrationToken, setLocalStorageRegistrationToken } from '../auth/auth.service';
import { fetchAppDependencies, loginThunk } from '../auth/auth.thunk';
import { fetchRegistration, register, submitAnswer, uploadRegistrationAvatar } from './registration.service';

export const fetchRegistrationThunk = createAsyncThunk<{ answer: RegistrationAnswerDTO; isFinished: boolean }, undefined, { rejectValue: string }>(
    'registration/fetch',
    async (_, { rejectWithValue }) => {
        try {
            return await fetchRegistration();
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);

export const submitAnswerThunk = createAsyncThunk<
    { submission: RegistrationSubmitREQ; isFinished: boolean },
    RegistrationSubmitREQ,
    { rejectValue: string }
>('registration/submit-answer', async (body, { rejectWithValue, getState, dispatch }) => {
    const { uid } = (getState() as RootState).account as AccountState;
    if (!uid) throw new Error('UID is required to make this action');
    try {
        const resp = await submitAnswer(uid, body);
        if (resp.isFinished) dispatch(fetchAppDependencies());
        return { submission: body, isFinished: resp.isFinished };
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const uploadAvatarThunk = createAsyncThunk<RegistrationImageUploadRESP, { file: File }, { rejectValue: string }>(
    'registration/upload-avatar',
    async ({ file }, { rejectWithValue, getState }) => {
        const { uid } = (getState() as RootState).account as AccountState;
    if (!uid) throw new Error('UID is required to make this action');
        try {
            return await uploadRegistrationAvatar(uid, file);
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);

export const registerThunk = createAsyncThunk<RegistrationOverallRESP, RegistrationRegisterREQ, { rejectValue: string }>(
    'registration/register',
    async (body, { rejectWithValue, dispatch }) => {
        try {
            const resp = await register(body);
            dispatch(loginThunk({ email: body.email, password: body.password }));
            return resp;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);

export const addRegistionTokenThunk = createAsyncThunk<void, undefined, { rejectValue: string }>(
    'registration/add-registration-token',
    async (_, { rejectWithValue }) => {
        try {
            let token = getLocalStorageRegistrationToken();
            const firebaseMessaging = await messaging;
            if(!token && firebaseMessaging) {
                token = await getToken(firebaseMessaging, { vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY });
                if (!token) return;
                setLocalStorageRegistrationToken(token);
            }
            await addRegistrationToken(token as string);
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);