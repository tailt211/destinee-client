import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FriendDTO } from '../../model/friend/dto/friend.dto';

import { PendingAction, RejectedAction } from '../store-type';
import { appendFriendThunk, fetchFriendsThunk, loadMoreFriendsThunk } from './friend.thunk';

export type FriendState = {
    loading: boolean;
    currentPage: number;
    isDataAvailable: boolean;
    totalCount: number;
    isFirstLoad: boolean;
    error?: string;
    friends: FriendDTO[];
};

const initialState: FriendState = {
    loading: true,
    currentPage: 1,
    totalCount: 0,
    isFirstLoad: true,
    isDataAvailable: false,
    friends: [],
};

const friendSlice = createSlice({
    name: 'friend',
    initialState: initialState,
    reducers: {
        resetState: () => initialState,
        removeFriend: (state, { payload }: PayloadAction<{ id: string }>) => {
            const index = state.friends.findIndex((f) => f.id === payload.id);
            if (index >= 0) {
                state.friends.splice(index, 1);
                state.totalCount--;
            }
        },
    },
    extraReducers: (builder) => [
        builder.addCase(fetchFriendsThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.friends = payload.friends;
            if (state.isFirstLoad) {
                state.totalCount = payload.totalCount;
                state.isFirstLoad = false;
            }
            state.currentPage = 1;
            if (payload.friends.length === 0) state.isDataAvailable = false;
            else state.isDataAvailable = true;
        }),
        builder.addCase(loadMoreFriendsThunk.fulfilled, (state, { payload }) => {
            state.friends = [...state.friends, ...payload.friends];
            state.currentPage = payload.page;
            if (payload.friends.length === 0) state.isDataAvailable = false;
            else state.isDataAvailable = true;
        }),
        builder.addCase(appendFriendThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.friends.unshift(payload);
            state.totalCount++;
        }),
        builder.addMatcher(
            (action): action is PendingAction =>
                action.type.startsWith('friend/') && action.type.endsWith('/pending') && !action.type.includes('load-more'),
            (state, action) => {
                state.loading = true;
            },
        ),
        builder.addMatcher(
            (action): action is RejectedAction => action.type.startsWith('friend/') && action.type.endsWith('/rejected'),
            (state, { payload }) => {
                state.loading = false;
                state.error = payload! as string;
            },
        ),
    ],
});

export const { resetState, removeFriend } = friendSlice.actions;

export default friendSlice.reducer;
