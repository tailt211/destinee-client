import { createAsyncThunk } from '@reduxjs/toolkit';
import { User } from 'firebase/auth';
import { getToken } from 'firebase/messaging';
import { auth, messaging } from '../../firebase';
import { destineeApi } from '../../https';
import { AccountDTO } from '../../model/account/dto/account.dto';
import { resetState as resetAccountState } from '../account/account.slice';
import { fetchAccountThunk } from '../account/account.thunk';
import { resetState as resetAuthState } from '../auth/auth.slice';
import { resetState as resetCallHistoryState } from '../call-history/call-history.slice';
import { fetchCallHistoryThunk } from '../call-history/call-history.thunk';
import { resetState as resetCallState } from '../call/call.slice';
import { resetState as resetConversationState } from '../conversation/conversation.slice';
import { fetchConversationsThunk } from '../conversation/conversation.thunk';
import { resetState as resetFavoriteSettingState } from '../favorite-setting/favorite-setting.slice';
import { resetState as resetFriendProfileState } from '../friend-profile/friend-profile.slice';
import { resetState as resetFriendRequestState } from '../friend-request/friend-request.slice';
import { fetchFriendRequestsThunk } from '../friend-request/friend-request.thunk';
import { resetState as resetFriendState } from '../friend/friend.slice';
import { fetchFriendsThunk } from '../friend/friend.thunk';
import { resetState as resetHomeState } from '../home/home.slice';
import { resetState as resetMessageState } from '../message/message.slice';
import { resetState as resetNotificationState } from '../notification/notification.slice';
import { fetchNotificationsThunk, fetchUnseenNotificationCountThunk } from '../notification/notification.thunk';
import { resetState as resetPersonalityTestHistoryState } from '../personality-test-history/personality-test-history.slice';
import { resetState as resetPersonalityTestState } from '../personality-test/personality-test.slice';
import { resetState as resetProfileState } from '../profile/profile.slice';
import { fetchProfileThunk } from '../profile/profile.thunk';
import { fetchRegistrationThunk } from '../registration/registration.thunk';
import {
    clearLocalStorageToken,
    getLocalStorageRegistrationToken,
    loginFirebase,
    addRegistrationToken,
    removeRegistrationToken,
    setLocalStorageRegistrationToken,
    setLocalStorageToken,
    resetPassword,
} from './auth.service';

export const loginThunk = createAsyncThunk<void, { email: string; password: string }, { rejectValue: string }>(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const { user } = await loginFirebase(email, password);
            destineeApi.defaults.headers.common['Authorization'] = `Bearer ${await user.getIdToken(true)}`;
            
            const firebaseMessaging = await messaging;
            if ('Notification' in window && firebaseMessaging) {
                const permission = await Notification.requestPermission();
                if (permission === 'denied') {
                    console.warn('Tắt thông báo sẽ ảnh hưởng đến trải nghiệm của bạn (*Dev: hiện alert)');
                    return;
                }
                const token = await getToken(firebaseMessaging, { vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY });
                if (!token) return;
                setLocalStorageRegistrationToken(token);
                await addRegistrationToken(token);
            }
        } catch (err: any) {
            console.log(err);
            return rejectWithValue(err.message);
        }
    },
);

export const forgotPasswordThunk = createAsyncThunk<void, { email: string; }, { rejectValue: string }>(
    'auth/forgot-password',
    async ({ email }, { rejectWithValue }) => {
        try {
            await resetPassword(email);
        } catch (err: any) {
            console.log(err);
            return rejectWithValue(err.message);
        }
    });

export const logoutThunk = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
    const regToken = getLocalStorageRegistrationToken();
    clearLocalStorageToken();
    dispatch(removeRegistrationTokenThunk(regToken));
    dispatch(resetHomeState());
    dispatch(resetAuthState());
    dispatch(resetAccountState());
    dispatch(resetProfileState());
    dispatch(resetFavoriteSettingState());
    dispatch(resetCallState());
    dispatch(resetCallHistoryState());
    dispatch(resetFriendState());
    dispatch(resetFriendRequestState());
    dispatch(resetFriendProfileState());
    dispatch(resetPersonalityTestState());
    dispatch(resetPersonalityTestHistoryState());
    dispatch(resetConversationState());
    dispatch(resetMessageState());
    dispatch(resetNotificationState());
    await auth.signOut();
});

export const setTokenThunk = createAsyncThunk<{ token: string; tokenExpiresTime: number }, User, { rejectValue: string }>(
    'auth/setToken',
    async (userAuth, { rejectWithValue, dispatch }) => {
        try {
            const tokenResult = await userAuth?.getIdTokenResult(true);
            const token = tokenResult?.token!;
            const expiresTime = Date.parse(tokenResult?.expirationTime!);
            setLocalStorageToken(token, expiresTime);
            destineeApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            dispatch(fetchAppDependencies());

            return { token, tokenExpiresTime: expiresTime };
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);

export const refreshTokenThunk = createAsyncThunk<{ token: string; tokenExpiresTime: number }, User, { rejectValue: string }>(
    'auth/refreshToken',
    async (userAuth, { rejectWithValue, dispatch }) => {
        try {
            console.warn('Token is expired, Refreshing token');
            const tokenResult = await userAuth?.getIdTokenResult(true);
            const token = tokenResult?.token!;
            const expiresTime = Date.parse(tokenResult?.expirationTime!);

            setLocalStorageToken(token, expiresTime);
            destineeApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            return { token, tokenExpiresTime: expiresTime };
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);

export const fetchAppDependencies = createAsyncThunk<void, undefined, { rejectValue: string }>(
    'auth/fetch-app-dependencies',
    async (_, { dispatch }) => {
        try {
            const { payload, meta } = await dispatch(fetchAccountThunk({}));
            if (meta.requestStatus === 'fulfilled') {
                const account = payload as AccountDTO;
                if (account.profileId && !account.disabled) {
                    dispatch(fetchProfileThunk(account.profileId));
                    dispatch(fetchFriendRequestsThunk());
                    dispatch(fetchNotificationsThunk());
                    dispatch(fetchUnseenNotificationCountThunk());
                    dispatch(fetchCallHistoryThunk(account.profileId));
                    dispatch(fetchFriendsThunk());
                    dispatch(fetchConversationsThunk());
                } else dispatch(fetchRegistrationThunk());
            }
        } catch (err: any) {
            console.log(err);
        }
    },
);
export const removeRegistrationTokenThunk = createAsyncThunk<void, string | null, { rejectValue: string }>(
    'auth/removeRegistrationToken',
    async (token, { rejectWithValue }) => {
        try {
            if (!token) return;
            await removeRegistrationToken(token);
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);
