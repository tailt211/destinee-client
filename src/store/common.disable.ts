import { createAsyncThunk } from '@reduxjs/toolkit';
import { updateDisabled as updateCallHistoryDisabled } from './call-history/call-history.slice';
import { updateDisabled as updateConversationDisabled } from './conversation/conversation.slice';
import { removeFriend } from './friend/friend.slice';

export const disableProfileThunk = createAsyncThunk<void, string, { rejectValue: string }>(
    'common/disable',
    async (id, { rejectWithValue, dispatch }) => {
        try {
            dispatch(updateConversationDisabled({ profileId: id }));
            dispatch(updateCallHistoryDisabled({ profileId: id }));
            dispatch(removeFriend({ id: id }));
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);
