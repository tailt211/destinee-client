import { createAsyncThunk } from '@reduxjs/toolkit';
import { PostOverallDTO } from '../../model/post/dto/post-overall.dto';
import { fetchMyPosts, uploadPost } from './my-profile.service';

export const uploadPostThunk = createAsyncThunk<PostOverallDTO, { file: File }, { rejectValue: string }>(
    'my-profile/upload-post',
    async ({ file }, { rejectWithValue }) => {
        try {
            return await uploadPost(file);
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);

export const fetchMyPostsThunk = createAsyncThunk<PostOverallDTO[], undefined, { rejectValue: string }>(
    'my-profile/fetch-posts',
    async (_, { rejectWithValue }) => {
        try {
            const { posts } = await fetchMyPosts();
            return posts;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);

export const loadMoreMyPostsThunk = createAsyncThunk<{ posts: PostOverallDTO[]; page: number }, number, { rejectValue: string }>(
    'my-profile/load-more-posts',
    async (page, { rejectWithValue }) => {
        try {
            return await fetchMyPosts(page);
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);
