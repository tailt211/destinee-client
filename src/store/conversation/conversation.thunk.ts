import { createAsyncThunk } from '@reduxjs/toolkit';
import { ConversationDTO } from '../../model/conversation/dto/conversation.dto';
import { ConversationCreateREQ } from '../../model/conversation/request/conversation-create.request';
import { updateConversationId } from '../call-history/call-history.slice';
import { createConversation, fetchConversations, seenConversation } from './conversation.service';
import { MessageOtherProfileDTO } from '../../model/message/dto/message-other-profile.dto';
import { addNewConversation, ConversationState, updateLastMessage } from './conversation.slice';
import { RootState } from '..';
import { MessageState } from '../message/message.slice';
import { archiveNotificationThunk, fetchUnseenNotificationCountThunk } from '../notification/notification.thunk';
import {
    removeNotification,
    decreaseUnseenCountByOne,
} from '../notification/notification.slice';
import { NOTIFICATION_TYPE } from '../../model/notification/notification-type';

export const fetchConversationsThunk = createAsyncThunk<{ conversations: ConversationDTO[] }, undefined, { rejectValue: string }>(
    'conversation/fetch',
    async (_, { rejectWithValue }) => {
        try {
            return await fetchConversations();
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);

export const loadMoreConversationThunk = createAsyncThunk<
    { conversations: ConversationDTO[]; page: number },
    number,
    { rejectValue: string }
>('conversation/load-more', async (page, { rejectWithValue }) => {
    try {
        return await fetchConversations(page);
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const createConversationThunk = createAsyncThunk<
    ConversationDTO,
    { body: ConversationCreateREQ; profile: MessageOtherProfileDTO },
    { rejectValue: string }
>('conversation/create', async ({ body, profile }, { rejectWithValue, dispatch }) => {
    try {
        const conversationId = await createConversation(body);
        dispatch(updateConversationId({ conversationId, profileId: body.profileId }));
        return {
            id: conversationId,
            isSeen: true,
            lastMessage: '',
            other: {
                profileId: profile.id,
                avatar: profile.avatar,
                name: profile.name,
                gender: profile.gender,
            },
        } as ConversationDTO;
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const seenConversationThunk = createAsyncThunk<
    string,
    { conversationId: string; profileId: string },
    { rejectValue: string }
>('conversation/seen', async ({ conversationId, profileId }, { rejectWithValue, dispatch }) => {
    try {
        await seenConversation(conversationId);
        dispatch(removeNotification({ type: NOTIFICATION_TYPE.DIRECT_MESSAGE, profileId: profileId }));
        dispatch(fetchUnseenNotificationCountThunk());
        return conversationId;
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const notificationHandleThunk = createAsyncThunk<
    void,
    { conversation: ConversationDTO; notificationId: string },
    { rejectValue: string }
>('conversation/notification-handle', async ({ conversation, notificationId }, { getState, dispatch }) => {
    const { conversations } = (getState() as RootState).conversation as ConversationState;
    const { conversationId } = (getState() as RootState).message as MessageState;
    const existed = conversations.find((c) => c.id === conversation.id);
    const isChatting = conversationId === conversation.id;

    if (!existed) {
        dispatch(addNewConversation(conversation));
        return;
    }
    dispatch(
        updateLastMessage({
            isSeen: isChatting,
            conversationId: conversation.id,
            lastMessage: conversation.lastMessage,
            lastMessageAt: conversation.lastMessageAt!,
        }),
    );
    if (!isChatting) return;
    dispatch(decreaseUnseenCountByOne());
    dispatch(archiveNotificationThunk(notificationId));
    dispatch(seenConversationThunk({ conversationId, profileId: conversation.other.profileId }));
});
