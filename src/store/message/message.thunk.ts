import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '..';
import { MessageOtherProfileDTO } from '../../model/message/dto/message-other-profile.dto';
import { MessageDTO } from '../../model/message/dto/message.dto';
import { MessageCreateREQ } from '../../model/message/request/message-create.request';
import { updateLastMessage } from '../conversation/conversation.slice';
import { seenConversationThunk } from '../conversation/conversation.thunk';
import { fetchMessages, getOtherProfile, sendMessage } from './message.service';

export const fetchMessagesThunk = createAsyncThunk<
    { messages: MessageDTO[]; conversationId: string },
    string,
    { rejectValue: string }
>('message/fetch', async (conversationId, { rejectWithValue, dispatch, getState }) => {
    try {
        const messages = await fetchMessages(conversationId);
        const { conversations } = (getState() as RootState).conversation;
        const conversation = conversations.find((conversation) => conversation.id === conversationId);
        if (conversation && !conversation.isSeen)
            dispatch(seenConversationThunk({ conversationId, profileId: conversation.other.profileId }));

        return { messages, conversationId };
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const loadMoreMessagesThunk = createAsyncThunk<
    { messages: MessageDTO[]; page: number },
    { conversationId: string; page: number },
    { rejectValue: string }
>('message/load-more', async ({ conversationId, page }, { rejectWithValue }) => {
    try {
        const messages = await fetchMessages(conversationId, page);
        return { messages, page };
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const sendMessageThunk = createAsyncThunk<
    { id: string; content: string },
    { conversationId: string; body: MessageCreateREQ },
    { rejectValue: string }
>('message/send', async ({ conversationId, body }, { rejectWithValue, dispatch }) => {
    try {
        const message = await sendMessage(conversationId, body);
        dispatch(
            updateLastMessage({
                isSeen: true,
                conversationId,
                lastMessageAt: new Date().toISOString(),
                lastMessage: body.content,
            }),
        );
        return message;
    } catch (err: any) {
        console.log(err);
        
        return rejectWithValue(err.message);
    }
});

export const getOtherProfileThunk = createAsyncThunk<MessageOtherProfileDTO, string, { rejectValue: string }>(
    'message/get-other-profile',
    async (conversationId, { rejectWithValue }) => {
        try {
            return await getOtherProfile(conversationId);
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);
