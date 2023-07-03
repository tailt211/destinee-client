import { createAsyncThunk } from '@reduxjs/toolkit';
import { FriendRequestDTO } from '../../model/friend-request/dto/friend-request.dto';
import { FRIEND_REQUEST_STATUS } from '../../model/friend-request/friend-request-status.enum';
import { UnfriendRequestREQ } from '../../model/friend-request/request/friend-request-unfriend.request';
import { VerifyFriendRequestREQ } from '../../model/friend-request/request/friend-request-verify.request';
import { NOTIFICATION_TYPE } from '../../model/notification/notification-type';
import { changeStatusFriendRequest } from '../call-history/call-history.slice';
import { removeFriend } from '../friend/friend.slice';
import { appendFriendThunk } from '../friend/friend.thunk';
import { removeNotification } from '../notification/notification.slice';
import { fetchUnseenNotificationCountThunk } from '../notification/notification.thunk';
import { fetchFriendRequests, unfriendRequest, verifyFriendRequest } from './friend-request.service';

export const fetchFriendRequestsThunk = createAsyncThunk<
    { friendRequests: FriendRequestDTO[]; totalCount: number },
    undefined,
    { rejectValue: string }
>('friend-request/fetch', async (_, { rejectWithValue }) => {
    try {
        return await fetchFriendRequests();
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const loadMoreFriendRequestsThunk = createAsyncThunk<
    { friendRequests: FriendRequestDTO[]; page: number },
    number,
    { rejectValue: string }
>('friend-request/load-more', async (page, { rejectWithValue }) => {
    try {
        return await fetchFriendRequests(page);
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const verifyFriendRequestThunk = createAsyncThunk<string, VerifyFriendRequestREQ, { rejectValue: string }>(
    'friend-request/verify',
    async (body, { dispatch, rejectWithValue }) => {
        try {
            await verifyFriendRequest(body);
            dispatch(
                changeStatusFriendRequest({
                    profileId: body.profileId,
                    status: body.isAccept ? FRIEND_REQUEST_STATUS.ACCEPTED : FRIEND_REQUEST_STATUS.DENIED,
                }),
            );
            dispatch(removeNotification({ type: NOTIFICATION_TYPE.FRIEND_REQUEST, profileId: body.profileId }));
            dispatch(fetchUnseenNotificationCountThunk());
            if (body.isAccept) dispatch(appendFriendThunk(body.profileId));
            return body.profileId;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);

export const unfriendRequestThunk = createAsyncThunk<void, UnfriendRequestREQ, { rejectValue: string }>(
    'friend-request/unfriend',
    async (body, { rejectWithValue, dispatch }) => {
        try {
            await unfriendRequest(body);
            dispatch(removeFriend({id : body.profileId}))
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);
