import { createSlice } from '@reduxjs/toolkit';
import { PostOverallDTO } from '../../model/post/dto/post-overall.dto';

import { RejectedAction } from '../store-type';
import { fetchMyPostsThunk, loadMoreMyPostsThunk, uploadPostThunk } from './my-profile.thunk';

export type MyProfileState = {
    loading: boolean;
    isSubmitting: boolean;
    error?: string;
    currentPage: number;
    isDataAvailable: boolean;
    posts: PostOverallDTO[];
};

const initialState: MyProfileState = {
    loading: false,
    isSubmitting: false,
    isDataAvailable: true,
    currentPage: 1,
    posts: [],
};

const myProfileSlice = createSlice({
    name: 'my-profile',
    initialState: initialState,
    reducers: {
        resetState: () => initialState,
    },
    extraReducers: (builder) => [
        builder.addCase(uploadPostThunk.pending, (state, { payload }) => {
            state.isSubmitting = true;
        }),
        builder.addCase(uploadPostThunk.fulfilled, (state, { payload }) => {
            state.isSubmitting = false;
            state.posts.unshift(payload);
        }),
        builder.addCase(fetchMyPostsThunk.pending, (state, { payload }) => {
            state.loading = true;
        }),
        builder.addCase(fetchMyPostsThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.posts = payload;
            state.currentPage = 1;
            if (payload.length === 0) state.isDataAvailable = false;
            else state.isDataAvailable = true;
        }),
        builder.addCase(loadMoreMyPostsThunk.fulfilled, (state, { payload }) => {
            state.currentPage = payload.page;
            state.posts = [...state.posts, ...payload.posts];
            if (payload.posts.length === 0) state.isDataAvailable = false;
            else state.isDataAvailable = true;
        }),
        // builder.addMatcher(
        //     (action): action is PendingAction =>
        //         action.type.startsWith('my-profile/') && action.type.endsWith('/pending') && !action.type.includes('load-more'),
        //     (state, action) => {
        //         state.loading = true;
        //     },
        // ),
        builder.addMatcher(
            (action): action is RejectedAction => action.type.startsWith('my-profile/') && action.type.endsWith('/rejected'),
            (state, { payload }) => {
                state.loading = false;
                state.isSubmitting = false;
                state.error = payload! as string;
            },
        ),
    ],
});

export const { resetState } = myProfileSlice.actions;

export default myProfileSlice.reducer;
