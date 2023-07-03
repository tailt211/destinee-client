import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type PageBlock = {
    isBlockCallHistoryPage: boolean;
    isBlockMessagePage: boolean;
    isBlockFriendPage: boolean;
    isLimitCall: boolean;
};

export type HomeState = {
    loading: boolean;
    error?: string;
    onlineUsers: number;
    isAudioReady: boolean;
    callCountLeft: number;
} & PageBlock;

export const initialState: HomeState = {
    loading: false,
    onlineUsers: 0,
    isAudioReady: false,
    callCountLeft: 0,
    isBlockCallHistoryPage: false,
    isBlockMessagePage: false,
    isBlockFriendPage: false,
    isLimitCall: false,
};

export const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        clearError: (state) => { state.error = undefined },
        resetState: (state) => ({ ...initialState, isAudioReady: state.isAudioReady }),
        setOnlineUser: (state, action: PayloadAction<number>) => {
            state.onlineUsers = action.payload;
        },
        setCallCountLeft: (state, action: PayloadAction<number>) => {
            state.callCountLeft = action.payload;
        },
        enableAudio: (state) => { state.isAudioReady = true },
        blockPage: (state, { payload }: PayloadAction<PageBlock>) => {
            state.isBlockCallHistoryPage = payload.isBlockCallHistoryPage;
            state.isBlockFriendPage = payload.isBlockFriendPage;
            state.isBlockMessagePage = payload.isBlockMessagePage;
            state.isLimitCall = payload.isLimitCall;
        },
    },
});

export const { clearError, resetState, setOnlineUser, enableAudio, setCallCountLeft, blockPage } = homeSlice.actions;

export default homeSlice.reducer;
