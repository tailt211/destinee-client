import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FriendRequestDTO } from '../../model/friend-request/dto/friend-request.dto';
import { PendingAction, RejectedAction } from '../store-type';
import {
    fetchFriendRequestsThunk,
    loadMoreFriendRequestsThunk,
    unfriendRequestThunk,
    verifyFriendRequestThunk,
} from './friend-request.thunk';

export type FriendRequestState = {
    loading: boolean;
    error?: string;
    isDataAvailable: boolean;
    currentPage: number;
    friendRequests: FriendRequestDTO[];
    totalCount: number;
};

const initialState: FriendRequestState = {
    loading: true,
    isDataAvailable : false,
    currentPage : 1,
    friendRequests: [],
    totalCount: 0
};

const friendRequestSlice = createSlice({
    name: 'friend-request-slice',
    initialState,
    reducers: {
        resetState: () => initialState,
        addFriendRequest: (state, { payload }: PayloadAction<FriendRequestDTO>) => {
            state.friendRequests.unshift(payload);
            state.totalCount++;
        },
        removeFriendRequest: (state, action: PayloadAction<string>) => {
            if (state.friendRequests === null || state.friendRequests.length === 0) return;
            else {
                state.friendRequests = state.friendRequests.filter(
                    (request) => request.profileId !== action.payload,
                );
                state.totalCount--;
            }
        },
    },
    extraReducers: (builder) => [
        builder.addCase(fetchFriendRequestsThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.currentPage = 1;
            state.friendRequests = payload.friendRequests;
            state.totalCount = payload.totalCount;
            if (payload.friendRequests.length === 0) state.isDataAvailable = false;
            else state.isDataAvailable = true;
        }),
        builder.addCase(loadMoreFriendRequestsThunk.fulfilled, (state, { payload }) => {
            state.currentPage = payload.page;
            state.friendRequests = [...state.friendRequests, ...payload.friendRequests];
            if (payload.friendRequests.length === 0) state.isDataAvailable = false;
            else state.isDataAvailable = true;
        }),
        builder.addCase(verifyFriendRequestThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            if (state.friendRequests === null || state.friendRequests.length === 0)return;
            else {
                state.friendRequests = state.friendRequests.filter(
                    (request) => request.profileId !== payload,
                );
                state.totalCount--;
            }
        }),
        builder.addCase(unfriendRequestThunk.fulfilled, (state) => {
            state.loading = false;
        }),
        builder.addMatcher(
            (action): action is PendingAction =>
                action.type.startsWith('friend-request/') &&
                action.type.endsWith('/pending') &&
                !action.type.includes('load-more'),
            (state, action) => {
                state.loading = true;
            },
        ),
        builder.addMatcher(
            (action): action is RejectedAction =>
                action.type.startsWith('friend-request/') &&
                action.type.endsWith('/rejected'),
            (state, { payload }) => {
                state.loading = false;
                state.error = payload! as string;
            },
        ),
    ],
});

export const { resetState, addFriendRequest, removeFriendRequest } = friendRequestSlice.actions;

export default friendRequestSlice.reducer;
