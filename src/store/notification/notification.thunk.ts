import { createAsyncThunk } from '@reduxjs/toolkit';
import { chunk } from 'lodash';
import { RootState } from '..';
import { FriendRequestDTO } from '../../model/friend-request/dto/friend-request.dto';
import { NotificationDTO } from '../../model/notification/dto/notification.dto';
import { fetchFriendRequest } from '../friend-request/friend-request.service';
import {
    archiveNotification,
    fetchNotifications,
    fetchUnseenNotificationsCount,
    seenNotifications,
} from './notification.service';

export const fetchNotificationsThunk = createAsyncThunk<
    { notifications: NotificationDTO[]; totalCount: number },
    undefined,
    { rejectValue: string }
>('notification/fetch', async (_, { rejectWithValue }) => {
    try {
        const resp = await fetchNotifications();
        return { notifications: resp.notifications, totalCount: resp.totalCount };
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const loadMoreNotificationsThunk = createAsyncThunk<
    { notifications: NotificationDTO[]; totalCount: number; page: number },
    number,
    { rejectValue: string }
>('notification/load-more-notifications', async (page, { rejectWithValue }) => {
    try {
        return await fetchNotifications(page);
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const fetchUnseenNotificationCountThunk = createAsyncThunk<number, undefined, { rejectValue: string }>(
    'notification/fetch-unseen-count',
    async (_, { rejectWithValue }) => {
        try {
            return await fetchUnseenNotificationsCount();
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);

export const seenNotificationsThunk = createAsyncThunk<void, string[], { rejectValue: string }>(
    'notification/seen-notifications',
    async (ids, { rejectWithValue }) => {
        try {
            await seenNotifications(ids);
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);

export const fetchFriendRequestThunk = createAsyncThunk<FriendRequestDTO, string | undefined, { rejectValue: string }>(
    'notification/fetch-friend-request',
    async (id, { rejectWithValue }) => {
        try {
            return await fetchFriendRequest(id);
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);

export const archiveNotificationThunk = createAsyncThunk<string, string, { rejectValue: string }>(
    'notification/archive-notification',
    async (id, { getState, dispatch, rejectWithValue }) => {
        try {
            /* 
                Bắt buộc phải loadMore trước khi archive vì trước khi archive thì thằng ở page tiếp theo vẫn ở đúng vị trí đó
                -> page & limit hoạt động đúng
                Còn nếu loadMore sau -> thằng item của page sau sẽ trồi lên +1
            */
            const { isDataAvailable, notifications, currentPage } = (getState() as RootState).notification;
            if (isDataAvailable && notifications.length <= parseInt(process.env.REACT_APP_NOTIFICATION_LIMIT || '15'))
                await dispatch(loadMoreNotificationsThunk(currentPage + 1));
            await archiveNotification([id]);
            return id;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);

export const archiveAllNotificationThunk = createAsyncThunk<void, undefined, { rejectValue: string }>(
    'notification/archive-all-notifications',
    async (_, { getState, dispatch, rejectWithValue }) => {
        try {
            const { notifications } = (getState() as RootState).notification;
            if(notifications.length <= 0) return;
            const chunks = chunk(notifications.map(n => n.id), 20);
            for await (const chunk of chunks) {
                await archiveNotification(chunk);
            }
            dispatch(fetchNotificationsThunk());    
            dispatch(fetchUnseenNotificationCountThunk());    
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);
