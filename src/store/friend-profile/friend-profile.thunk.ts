import { createAsyncThunk } from '@reduxjs/toolkit';
import { CallHistoryDTO } from '../../model/call-history/dto/call-history.dto';
import { FriendDTO } from '../../model/friend/dto/friend.dto';
import { PostOverallDTO } from '../../model/post/dto/post-overall.dto';
import { fetchFriendCallHistories, fetchFriendPosts, fetchFriendProfile } from './friend-profile.service';

export const fetchFriendProfileThunk = createAsyncThunk<FriendDTO, string, { rejectValue: string }>(
    'friend-profile/fetch',
    async (id, { rejectWithValue }) => {
        try {
            return await fetchFriendProfile(id);
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);

export const fetchFriendCallHistoriesThunk = createAsyncThunk<
    { callHistories: CallHistoryDTO[] },
    string,
    { rejectValue: string }
>('friend-profile/fetch-call-histories', async (id, { rejectWithValue }) => {
    try {
        return await fetchFriendCallHistories(id, 1);
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const loadMoreFriendCallHistoriesThunk = createAsyncThunk<
    { callHistories: CallHistoryDTO[]; page: number },
    { id: string; page?: number },
    { rejectValue: string }
>('friend-profile/load-more-call-histories', async ({ id, page }, { rejectWithValue }) => {
    try {
        return await fetchFriendCallHistories(id, page);
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const fetchFriendPostsThunk = createAsyncThunk<PostOverallDTO[], string, { rejectValue: string }>(
    'friend-profile/fetch-posts',
    async (id, { rejectWithValue }) => {
        try {
            const { posts } = await fetchFriendPosts(id);
            return posts;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);

export const loadMoreFriendPostsThunk = createAsyncThunk<
    { posts: PostOverallDTO[]; page: number },
    { id: string; page: number },
    { rejectValue: string }
>('friend-profile/load-more-posts', async ({ id, page }, { rejectWithValue }) => {
    try {
        return await fetchFriendPosts(id, page);
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});
