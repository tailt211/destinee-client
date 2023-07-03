import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationDTO } from '../../model/notification/dto/notification.dto';
import { NOTIFICATION_TYPE } from '../../model/notification/notification-type';
import { PendingAction, RejectedAction } from '../store-type';
import {
    archiveNotificationThunk,
    fetchNotificationsThunk,
    fetchUnseenNotificationCountThunk,
    loadMoreNotificationsThunk,
    seenNotificationsThunk,
} from './notification.thunk';

export type NotificationState = {
    loading: boolean;
    loader: { [key: string]: boolean };
    error?: string;
    notifications: NotificationDTO[];
    unseenNotificationIds: string[];
    unseenCount: number;
    currentPage: number;
    totalCount: number;
    isDataAvailable: boolean;
    notificationTitle?: string;
};

export const initialState: NotificationState = {
    loading: true,
    loader: {},
    notifications: [],
    unseenNotificationIds: [],
    unseenCount: 0,
    currentPage: 1,
    totalCount: 0,
    isDataAvailable: false,
};

export const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setError: (state, { payload }: PayloadAction<string>) => {
            state.error = payload;
        },
        setLoader: (state, { payload }: PayloadAction<string>) => {
            state.loader[payload] = true;
        },
        removeLoader: (state, { payload }: PayloadAction<string>) => {
            delete state.loader[payload];
        },
        clearError: (state) => {
            state.error = undefined;
        },
        addNotification: (state, { payload }: PayloadAction<NotificationDTO>) => {
            if(payload.type === NOTIFICATION_TYPE.DIRECT_MESSAGE)
                state.notificationTitle = `${payload.data?.profileName} đã nhắn tin`;
            state.notifications.unshift(payload);
            state.unseenNotificationIds.unshift(payload.id);
            state.unseenCount++;
            state.totalCount++;
        },
        removeNotification: (state, { payload }: PayloadAction<{ type: NOTIFICATION_TYPE; profileId: string }>) => {
            state.notifications = state.notifications.filter(
                (n) => !(n.type === payload.type && n.data?.profileId === payload.profileId),
            );
            state.totalCount = state.notifications.length;
        },
        decreaseUnseenCountByOne: (state) => {
            state.unseenCount--;
        },
        clearNotificationTitle: (state) => { state.notificationTitle = undefined },
        resetState: () => initialState,
    },
    extraReducers: (builder) => [
        builder.addCase(fetchNotificationsThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.notifications = payload.notifications;
            state.currentPage = 1;
            state.totalCount = payload.totalCount;
            if (payload.notifications.length === 0) state.isDataAvailable = false;
            else {
                state.isDataAvailable = true;
                state.unseenNotificationIds = payload.notifications
                    .filter((notification) => notification.isSeen === false)
                    .map((notification) => notification.id);
            }
        }),
        builder.addCase(fetchUnseenNotificationCountThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.unseenCount = payload;
        }),
        builder.addCase(loadMoreNotificationsThunk.fulfilled, (state, { payload }) => {
            state.currentPage = payload.page;
            state.totalCount = payload.totalCount;
            state.notifications = [...state.notifications, ...payload.notifications];
            if (payload.notifications.length === 0) state.isDataAvailable = false;
            else {
                state.isDataAvailable = true;
                state.unseenNotificationIds = payload.notifications
                    .filter((notification) => !notification.isSeen)
                    .map((notification) => notification.id);
            }
        }),
        builder.addCase(seenNotificationsThunk.fulfilled, (state) => {
            state.loading = false;
            state.unseenNotificationIds = [];
        }),
        builder.addCase(archiveNotificationThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            if (!state.notifications || state.notifications.length === 0) return;
            state.notifications = state.notifications.filter((notification) => notification.id !== payload);
            state.totalCount--;
            delete state.loader[payload];
        }),
        builder.addMatcher(
            (action): action is PendingAction =>
                action.type.startsWith('notification/') &&
                action.type.endsWith('/pending') &&
                !action.type.includes('seen') &&
                !action.type.includes('fetch-friend-request') &&
                !action.type.includes('archive-notification') &&
                !action.type.includes('add') &&
                !action.type.includes('load-more') &&
                !action.type.includes('lfetch-unseen-count'),
            (state, action) => {
                state.loading = true;
            },
        ),
        builder.addMatcher(
            (action): action is RejectedAction => action.type.startsWith('notification/') && action.type.endsWith('/rejected'),
            (state, { payload }) => {
                state.loading = false;
                state.error = payload! as string;
            },
        ),
    ],
});

export const {
    setError,
    setLoader,
    removeLoader,
    clearError,
    resetState,
    addNotification,
    removeNotification,
    decreaseUnseenCountByOne,
    clearNotificationTitle,
} = notificationSlice.actions;

export default notificationSlice.reducer;
