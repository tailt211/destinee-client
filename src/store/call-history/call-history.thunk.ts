import { createAsyncThunk } from '@reduxjs/toolkit';
import { CallHistoryDTO } from '../../model/call-history/dto/call-history.dto';
import { FriendRequestCreate } from '../../model/friend-request/dto/friend-request-create.dto';
import { CreateFriendRequestREQ } from '../../model/friend-request/request/friend-request-create.request';
import { VerifyFriendRequestREQ } from '../../model/friend-request/request/friend-request-verify.request';
import { createFriendRequest } from '../friend-request/friend-request.service';
import * as friendRequestThunk from '../friend-request/friend-request.thunk';
import { fetchHistoryCall } from './call-history.service';

export const fetchCallHistoryThunk = createAsyncThunk<CallHistoryDTO[], string, { rejectValue: string }>(
    'call-history/fetch',
    async (id, { rejectWithValue }) => {
        try {
            return (await fetchHistoryCall(id)).callHistories;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);

export const loadMoreCallHistoryThunk = createAsyncThunk<
    { callHistories: CallHistoryDTO[]; page: number },
    { id: string; page: number },
    { rejectValue: string }
>('call-history/load-more', async ({ id, page }, { rejectWithValue }) => {
    try {
        return await fetchHistoryCall(id, page);
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const addFriendThunk = createAsyncThunk<FriendRequestCreate, CreateFriendRequestREQ, { rejectValue: string }>(
    'call-history/add-friend',
    async (body, { rejectWithValue }) => {
        try {
            return await createFriendRequest(body);
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);

export const verifyFriendRequestThunk = createAsyncThunk<boolean, VerifyFriendRequestREQ, { rejectValue: string }>(
    'call-history/verify-friend-request',
    async (body, { rejectWithValue, dispatch }) => {
        try {
            dispatch(friendRequestThunk.verifyFriendRequestThunk(body));
            return body.isAccept;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);
