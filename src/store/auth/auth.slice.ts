import { createSlice } from '@reduxjs/toolkit';
import { PendingAction, RejectedAction } from '../store-type';
import { fetchAppDependencies, forgotPasswordThunk, loginThunk, refreshTokenThunk, setTokenThunk } from './auth.thunk';

export interface AuthState {
    loading: boolean;
    isLoggingIn: boolean;
    isPasswordReseting: boolean;
    token?: string;
    tokenExpiresTime?: number;
    error?: string;
}

export const initialState: AuthState = {
    loading: true,
    isLoggingIn: false,
    isPasswordReseting: false,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = undefined;
        },
        resetState: () => initialState,
    },
    extraReducers: (builder) => [
        builder.addCase(loginThunk.pending, (state) => {
            state.isLoggingIn = true;
        }),
        builder.addCase(loginThunk.fulfilled, (state) => {
            state.isLoggingIn = false;
            state.error = undefined;
        }),
        builder.addCase(fetchAppDependencies.fulfilled, (state) => {
            state.loading = false;
        }),
        builder.addCase(setTokenThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.token = payload.token;
            state.tokenExpiresTime = payload.tokenExpiresTime;
            state.error = undefined;
        }),
        builder.addCase(refreshTokenThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.token = payload.token;
            state.tokenExpiresTime = payload.tokenExpiresTime;
            state.error = undefined;
        }),
        builder.addCase(forgotPasswordThunk.pending, (state) => {
            state.isPasswordReseting = true;
        }),
        builder.addCase(forgotPasswordThunk.fulfilled, (state) => {
            state.isPasswordReseting = false;
            state.error = undefined;
        }),
        builder.addMatcher(
            (action): action is PendingAction => action.type.startsWith('auth/') && action.type.endsWith('/pending'),
            (state, action) => {
                state.loading = true;
            },
        ),
        builder.addMatcher(
            (action): action is RejectedAction => action.type.startsWith('auth/') && action.type.endsWith('/rejected'),
            (state, { payload }) => {
                state.loading = false;
                state.isLoggingIn = false;
                state.isPasswordReseting = false;
                state.error = payload! as string;
            },
        ),
    ],
});

export const { clearError, resetState } = authSlice.actions;

export default authSlice.reducer;
