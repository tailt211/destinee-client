import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { truncate } from 'lodash';
import { ConversationDTO } from '../../model/conversation/dto/conversation.dto';
import { ImageDTO } from '../../model/image/dto/image.dto';
import { PendingAction, RejectedAction } from '../store-type';
import {
    createConversationThunk,
    fetchConversationsThunk,
    loadMoreConversationThunk,
    seenConversationThunk,
} from './conversation.thunk';

export interface ConversationState {
    loading: boolean;
    error?: string;
    isDataAvailable: boolean;
    currentPage: number;
    conversations: ConversationDTO[];
}

const initialState: ConversationState = {
    loading: true,
    isDataAvailable: false,
    currentPage: 1,
    conversations: [],
};

const LAST_MESSAGE_MAX_LEN = 60;

const conversationSlice = createSlice({
    name: 'conversation',
    initialState,
    reducers: {
        resetState: () => initialState,
        addNewConversation: (state, action: PayloadAction<ConversationDTO>) => {
            state.conversations.unshift(action.payload);
        },
        updateLastMessage: (
            state,
            {
                payload: { conversationId, isSeen, lastMessage, lastMessageAt },
            }: PayloadAction<{ isSeen: boolean; conversationId: string; lastMessageAt: string; lastMessage: string }>,
        ) => {
            const index = state.conversations.findIndex((conversation) => conversation.id === conversationId);
            if (index >= 0) {
                const lastMsg = state.conversations[index];
                lastMsg.isSeen = isSeen;
                lastMsg.lastMessageAt = lastMessageAt;
                lastMsg.lastMessage = truncate(lastMessage, { length: LAST_MESSAGE_MAX_LEN, omission: '' });
                state.conversations.splice(0, 0, state.conversations.splice(index, 1)[0]); // move to top conversations
            }
        },
        updateAvatar: (
            state,
            { payload: { avatar, profileId } }: PayloadAction<{ avatar?: string | ImageDTO; profileId: string }>,
        ) => {
            if (avatar) {
                const index = state.conversations.findIndex((conversation) => conversation.other.profileId === profileId);
                if (index >= 0) state.conversations[index].other.avatar = avatar;
            }
        },
        updateDisabled: (state, { payload: { profileId } }: PayloadAction<{ profileId: string }>) => {
            const index = state.conversations.findIndex((conversation) => conversation.other.profileId === profileId);
            if (index >= 0) {
                state.conversations[index].other.disabled = true;
                state.conversations[index].other.avatar = undefined;
                state.conversations[index].other.name = 'Người dùng không tồn tại';
            }
        },
    },
    extraReducers: (builder) => [
        builder.addCase(fetchConversationsThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.currentPage = 1;
            state.conversations = payload.conversations.map((c) => {
                c.lastMessage = truncate(c.lastMessage, { length: LAST_MESSAGE_MAX_LEN, omission: '' });
                return c;
            });
            if (payload.conversations.length === 0) state.isDataAvailable = false;
            else state.isDataAvailable = true;
        }),
        builder.addCase(loadMoreConversationThunk.fulfilled, (state, { payload }) => {
            state.currentPage = payload.page;
            state.conversations = [...state.conversations, ...payload.conversations];
            if (payload.conversations.length === 0) state.isDataAvailable = false;
            else state.isDataAvailable = true;
        }),
        builder.addCase(createConversationThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.conversations.push({
                id: payload.id,
                isSeen: true,
                lastMessage: '',
                other: {
                    profileId: payload.other.profileId,
                    avatar: payload.other.avatar,
                    name: payload.other.name,
                    gender: payload.other.gender,
                    disabled: payload.other.disabled,
                },
            });
        }),
        builder.addCase(seenConversationThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            const index = state.conversations.findIndex((conversation) => conversation.id === payload);
            if (index >= 0) state.conversations[index].isSeen = true;
        }),
        builder.addMatcher(
            (action): action is PendingAction =>
                action.type.startsWith('conversation/') &&
                action.type.endsWith('/pending') &&
                !action.type.includes('load-more') &&
                !action.type.includes('notification-handle'),
            (state, action) => {
                state.loading = true;
            },
        ),
        builder.addMatcher(
            (action): action is RejectedAction => action.type.startsWith('conversation/') && action.type.endsWith('/rejected'),
            (state, { payload }) => {
                state.loading = false;
                state.error = payload! as string;
            },
        ),
    ],
});

export const { resetState, addNewConversation, updateLastMessage, updateAvatar, updateDisabled } = conversationSlice.actions;

export default conversationSlice.reducer;
