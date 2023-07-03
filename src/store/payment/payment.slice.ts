import { createSlice } from '@reduxjs/toolkit';
import { PaymentDTO } from '../../model/payment/dto/payment.dto';
import { RejectedAction } from '../store-type';
import { fetchVnpayTransactionThunk } from './payment.thunk';

export type PaymentState = {
    loading: boolean;
    error?: string;
    payment?: PaymentDTO;
};

const initialState: PaymentState = {
    loading: true,
};

const paymentSlice = createSlice({
    name: 'payment',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = undefined;
        },
        resetState: () => initialState,
    },
    extraReducers: (builder) => [
        builder.addCase(fetchVnpayTransactionThunk.pending, (state) => {
            state.loading = true;
        }),
        builder.addCase(fetchVnpayTransactionThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.payment = payload;
        }),
        builder.addMatcher(
            (action): action is RejectedAction => action.type.startsWith('payment/') && action.type.endsWith('/rejected'),
            (state, { payload }) => {
                state.loading = false;
                state.error = payload! as string;
            },
        ),
    ],
});

export const { clearError, resetState } = paymentSlice.actions;

export default paymentSlice.reducer;
