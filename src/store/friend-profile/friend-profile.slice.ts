import { createSlice } from '@reduxjs/toolkit';
import { CallHistoryDTO } from '../../model/call-history/dto/call-history.dto';
import { FriendDTO as FriendProfileDTO } from '../../model/friend/dto/friend.dto';
import { PostOverallDTO } from '../../model/post/dto/post-overall.dto';

import { PendingAction, RejectedAction } from '../store-type';
import {
    fetchFriendCallHistoriesThunk,
    fetchFriendPostsThunk,
    fetchFriendProfileThunk,
    loadMoreFriendCallHistoriesThunk,
    loadMoreFriendPostsThunk,
} from './friend-profile.thunk';

export type FriendProfileState = {
    loading: boolean;
    error?: string;
    profile?: FriendProfileDTO;
    callHistories: CallHistoryDTO[];
    posts: PostOverallDTO[];
    postCurrentPage: number;
    callHistoryCurrentPage: number;
    isPostDataAvailable: boolean;
    isCallHistoryDataAvailable: boolean;
};

const initialState: FriendProfileState = {
    loading: true,
    posts: [],
    callHistories: [],
    isPostDataAvailable: true,
    isCallHistoryDataAvailable: true,
    postCurrentPage: 1,
    callHistoryCurrentPage: 1,
};

const friendProfileSlice = createSlice({
    name: 'friend-profile',
    initialState: initialState,
    reducers: {
        resetState: () => initialState,
    },
    extraReducers: (builder) => [
        builder.addCase(fetchFriendProfileThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.profile = payload;
        }),
        builder.addCase(fetchFriendCallHistoriesThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.callHistories = payload.callHistories;
            state.callHistoryCurrentPage = 1;
            if (payload.callHistories.length === 0) state.isCallHistoryDataAvailable = false;
            else state.isCallHistoryDataAvailable = true;
        }),
        builder.addCase(
            loadMoreFriendCallHistoriesThunk.fulfilled,
            (state, { payload }) => {
                state.callHistories = [...state.callHistories, ...payload.callHistories];
                state.callHistoryCurrentPage = payload.page;
                if (payload.callHistories.length === 0) state.isCallHistoryDataAvailable = false;
                else state.isCallHistoryDataAvailable = true;
            },
        ),
        builder.addCase(fetchFriendPostsThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.posts = payload;
            state.postCurrentPage = 1;
            if (payload.length === 0) state.isPostDataAvailable = false;
            else state.isPostDataAvailable = true;
        }),
        builder.addCase(loadMoreFriendPostsThunk.fulfilled, (state, { payload }) => {
            state.postCurrentPage = payload.page;
            state.posts = [...state.posts, ...payload.posts];
            if (payload.posts.length === 0) state.isPostDataAvailable = false;
            else state.isPostDataAvailable = true;
        }),
        builder.addMatcher(
            (action): action is PendingAction =>
                action.type.startsWith('friend-profile/') &&
                action.type.endsWith('/pending') &&
                !action.type.includes('load-more'),
            (state, action) => {
                state.loading = true;
            },
        ),
        builder.addMatcher(
            (action): action is RejectedAction =>
                action.type.startsWith('friend-profile/') &&
                action.type.endsWith('/rejected'),
            (state, { payload }) => {
                state.loading = false;
                state.error = payload! as string;
            },
        ),
    ],
});

export const { resetState } = friendProfileSlice.actions;

export default friendProfileSlice.reducer;
