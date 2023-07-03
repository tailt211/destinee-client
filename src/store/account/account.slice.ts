import { createSlice } from '@reduxjs/toolkit';
import { AccountDTO } from '../../model/account/dto/account.dto';
import { fetchAccountThunk } from './account.thunk';

export type AccountState = {
    loading: boolean;
    error?: string;
} & Partial<AccountDTO>;

export const initialState: AccountState = {
    loading: false,
};

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        clearError: (state) => { state.error = undefined },
        resetState: () => initialState,
    },
    extraReducers: (builder) => [
        builder.addCase(fetchAccountThunk.pending, (state) => {
            state.loading = true;
        }),
        builder.addCase(fetchAccountThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.id = payload.id;
            state.profileId = payload.profileId;
            state.role = payload.role;
            state.uid = payload.uid;
            state.upgrade = payload.upgrade;
        }),
        builder.addCase(fetchAccountThunk.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload!;
        }),
    ],
});

export const { clearError, resetState } = accountSlice.actions;

export default accountSlice.reducer;
