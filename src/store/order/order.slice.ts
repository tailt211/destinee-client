import { createSlice } from "@reduxjs/toolkit";
import { RejectedAction } from "../store-type";
import { generatePremiumOrderThunk } from "./order.thunk";

export type OrderState = {
    loading: boolean;
    error?: string;
};

const initialState: OrderState = {
    loading: false,
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = undefined;
        },
        resetState: () => initialState,
    },
    extraReducers: (builder) => [
        builder.addCase(generatePremiumOrderThunk.pending, (state) => {
            state.loading = true;
        }),
        builder.addCase(generatePremiumOrderThunk.fulfilled, (state) => {
            state.loading = false;
        }),
        builder.addMatcher(
            (action): action is RejectedAction => action.type.startsWith('order/') && action.type.endsWith('/rejected'),
            (state, { payload }) => {
                state.loading = false;
                state.error = payload! as string;
            },
        ),
    ],
});

export const { clearError, resetState } = orderSlice.actions;

export default orderSlice.reducer;