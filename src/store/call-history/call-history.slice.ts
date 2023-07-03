import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CallHistoryDTO } from '../../model/call-history/dto/call-history.dto';
import { FRIEND_REQUEST_PROCESS_STATUS } from '../../model/friend-request/friend-request-process-status.enum';
import { FRIEND_REQUEST_STATUS } from '../../model/friend-request/friend-request-status.enum';
import { ImageDTO } from '../../model/image/dto/image.dto';
import { PendingAction, RejectedAction } from '../store-type';
import { addFriendThunk, fetchCallHistoryThunk, loadMoreCallHistoryThunk, verifyFriendRequestThunk } from './call-history.thunk';

export interface CallHistoryState {
    loading: boolean;
    currentPage: number;
    isDataAvailable: boolean;
    error?: string;
    callHistories: CallHistoryDTO[];
    isSended?: FRIEND_REQUEST_PROCESS_STATUS;
}

const initialState: CallHistoryState = {
    loading: true,
    callHistories: [],
    isSended: FRIEND_REQUEST_PROCESS_STATUS.DEFAULT,
    currentPage: 1,
    isDataAvailable: false,
};

const callHistorySlice = createSlice({
    name: 'call-history',
    initialState: initialState,
    reducers: {
        resetState: () => initialState,
        changeStatusFriendRequest: (
            state,
            {
                payload: { profileId, status, myPending = false },
            }: PayloadAction<{ profileId: string; status: FRIEND_REQUEST_STATUS | null; myPending?: boolean }>,
        ) => {
            state.callHistories = state.callHistories.map((history) => {
                if (!history.friendRequest) return history;
                if (history.other.id === profileId)
                    return {
                        ...history,
                        friendRequest: status ? {
                            requester: !myPending ? history.friendRequest.requester : history.friendRequest.verifier,
                            verifier: !myPending ? history.friendRequest.verifier : history.friendRequest.requester,
                            status: status,
                        } : {},
                    } as CallHistoryDTO;

                return history;
            });
        },
        updateConversationId: (state, action: PayloadAction<{ profileId: string; conversationId: string }>) => {
            state.callHistories = state.callHistories.map((history) => {
                if (history.other.id === action.payload.profileId) history.conversationId = action.payload.conversationId;
                return history;
            });
        },
        updateAvatar: (state, action: PayloadAction<{ profileId: string; newAvatar: string | ImageDTO }>) => {
            state.callHistories = state.callHistories.map((history) => {
                if (history.other.id === action.payload.profileId) history.other.avatar = action.payload.newAvatar;
                return history;
            });
        },
        updateDisabled: (state, { payload: { profileId } }: PayloadAction<{ profileId: string }>) => {
            state.callHistories = state.callHistories.map((history) => {
                if (history.other.id === profileId) {
                    history.other.avatar = undefined;
                    history.other.disabled = true;
                    history.other.name = 'Người dùng không tồn tại';
                }
                return history;
            });
        },
    },
    extraReducers: (builder) => [
        builder.addCase(fetchCallHistoryThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.callHistories = payload;
            state.currentPage = 1;
            if (payload.length === 0) state.isDataAvailable = false;
            else state.isDataAvailable = true;
        }),
        builder.addCase(loadMoreCallHistoryThunk.fulfilled, (state, { payload }) => {
            state.currentPage = payload.page;
            state.callHistories = [...state.callHistories, ...payload.callHistories];
            if (payload.callHistories.length === 0) state.isDataAvailable = false;
            else state.isDataAvailable = true;
        }),
        builder.addCase(addFriendThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.isSended = FRIEND_REQUEST_PROCESS_STATUS.ADD_FRIEND;
            state.callHistories = state.callHistories.map((history) => {
                if (!history.friendRequest) return history;
                if (history.other.id === payload.verifierId)
                    return {
                        ...history,
                        friendRequest: {
                            requester: payload.requesterId,
                            verifier: payload.verifierId,
                            status: payload.status,
                        },
                    } as CallHistoryDTO;
                return history;
            });
        }),
        builder.addCase(verifyFriendRequestThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.isSended = payload ? FRIEND_REQUEST_PROCESS_STATUS.ACCEPTED : FRIEND_REQUEST_PROCESS_STATUS.DENIED;
        }),
        builder.addMatcher(
            (action): action is PendingAction =>
                action.type.startsWith('call-history/') &&
                action.type.endsWith('/pending') &&
                !action.type.includes('friend') &&
                !action.type.includes('load-more'),
            (state, action) => {
                state.loading = true;
            },
        ),
        builder.addMatcher(
            (action): action is RejectedAction => action.type.startsWith('call-history/') && action.type.endsWith('/rejected'),
            (state, { payload }) => {
                state.loading = false;
                state.error = payload! as string;
            },
        ),
    ],
});

export const { resetState, changeStatusFriendRequest, updateConversationId, updateAvatar, updateDisabled } = callHistorySlice.actions;

export default callHistorySlice.reducer;
