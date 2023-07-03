import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MessageOtherProfileDTO } from '../../model/message/dto/message-other-profile.dto';
import { MessageDTO } from '../../model/message/dto/message.dto';
import { GENDER } from '../../model/profile/profile.constant';
import { PendingAction, RejectedAction } from '../store-type';
import { fetchMessagesThunk, getOtherProfileThunk, loadMoreMessagesThunk, sendMessageThunk } from './message.thunk';

export type MessageState = {
    loading: boolean;
    error?: string;
    isDataAvailable: boolean;
    currentPage: number;
    messages: MessageDTO[];
    otherProfile: MessageOtherProfileDTO;
    conversationId?: string;
};

const initialState: MessageState = {
    loading: true,
    isDataAvailable: false,
    currentPage: 1,
    messages: [],
    otherProfile: {
        id: '',
        avatar: '',
        name: '',
        gender: GENDER.FEMALE,
        disabled: false,
    },
};

const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        resetState: () => initialState,
        addOtherNewMessage: (state, { payload }: PayloadAction<{ otherMessage: MessageDTO; coversationId: string }>) => {
            if (state.conversationId && state.conversationId === payload.coversationId) {
                state.messages.unshift(payload.otherMessage);
                const lastMsg = state.messages[1];
                if (lastMsg && !lastMsg.isMine) lastMsg.isLastMessage = false;
            }
        },
        syncProfile: (state, action: PayloadAction<MessageOtherProfileDTO>) => {
            state.otherProfile = action.payload;
        },
    },
    extraReducers: (builder) => [
        builder.addCase(fetchMessagesThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.conversationId = payload.conversationId;
            state.currentPage = 1;
            state.messages = payload.messages.reverse().map((message, index) => {
                return {
                    ...message,
                    isLastMessage: payload.messages[index + 1] ? message.isMine !== payload.messages[index + 1].isMine : true,
                };
            });
            state.messages = state.messages.reverse();
            if (payload.messages.length === 0) state.isDataAvailable = false;
            else state.isDataAvailable = true;
        }),
        builder.addCase(loadMoreMessagesThunk.fulfilled, (state, { payload }) => {
            state.currentPage = payload.page;
            const loadMoreList = payload.messages.reverse().map((message, index) => {
                return {
                    ...message,
                    isLastMessage: payload.messages[index + 1] ? message.isMine !== payload.messages[index + 1].isMine : true,
                };
            });
            if (loadMoreList.length > 0) {
                loadMoreList[loadMoreList.length - 1].isMine === state.messages[state.messages.length - 1].isMine
                    ? (loadMoreList[loadMoreList.length - 1].isLastMessage = false)
                    : (loadMoreList[loadMoreList.length - 1].isLastMessage = true);
            }
            state.messages = [...state.messages, ...loadMoreList.reverse()];

            if (payload.messages.length === 0) state.isDataAvailable = false;
            else state.isDataAvailable = true;
        }),
        builder.addCase(getOtherProfileThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.otherProfile = payload;
        }),
        builder.addCase(sendMessageThunk.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload! as string;
        }),
        builder.addCase(sendMessageThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.messages.unshift({
                id: payload.id,
                content: payload.content,
                createdAt: new Date().toString(),
                isMine: true,
                isLastMessage: true,
            });
            const lastMsg = state.messages[1];
            if (lastMsg && lastMsg.isMine) lastMsg.isLastMessage = false;
        }),
        builder.addMatcher(
            (action): action is PendingAction =>
                action.type.startsWith('message/') &&
                action.type.endsWith('/pending') &&
                !action.type.includes('load-more') &&
                !action.type.includes('send'),
            (state, action) => {
                state.loading = true;
            },
        ),
        builder.addMatcher(
            (action): action is RejectedAction => action.type.startsWith('message/') && action.type.endsWith('/rejected'),
            (state, { payload }) => {
                state.loading = false;
                state.error = payload! as string;
            },
        ),
    ],
});

export const { resetState, addOtherNewMessage, syncProfile } = messageSlice.actions;

export default messageSlice.reducer;
