import { createAsyncThunk } from '@reduxjs/toolkit';
import { FriendDTO } from '../../model/friend/dto/friend.dto';
import { updateAvatar as updateCallHistoryAvatar } from '../call-history/call-history.slice';
import { updateAvatar as updateConversationAvatar } from '../conversation/conversation.slice';
import { fetchFriendProfile } from '../friend-profile/friend-profile.service';
import { fetchFriends } from './friend.service';

export const fetchFriendsThunk = createAsyncThunk<
    { friends: FriendDTO[], totalCount: number},
    string | undefined,
    { rejectValue: string }
>('friend/fetch', async (search, { rejectWithValue }) => {
    try {
        return (await fetchFriends(search, 1));
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const loadMoreFriendsThunk = createAsyncThunk<
    { friends: FriendDTO[], page: number },
    { search?: string, page?: number },
    { rejectValue: string }
>('friend/load-more-friends', async ({ search, page }, { rejectWithValue }) => {
    try {
        return await fetchFriends(search, page);
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const appendFriendThunk = createAsyncThunk<FriendDTO, string, { rejectValue: string }>(
    'friend/append-friend',
    async (id, { rejectWithValue, dispatch }) => {
        try {
            const friend = await fetchFriendProfile(id);
            if (friend.avatar) {
                dispatch(updateCallHistoryAvatar({ profileId: id, newAvatar: friend.avatar }));
                dispatch(updateConversationAvatar({ avatar: friend.avatar, profileId: id }));
            }
            return friend;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);
