import { createAsyncThunk } from '@reduxjs/toolkit';
import { PaymentDTO } from '../../model/payment/dto/payment.dto';
import { PaymentVnpayREQ } from '../../model/payment/request/payment-vnpay.request';
import { fetchVnpayTransaction } from './payment.service';

export const fetchVnpayTransactionThunk = createAsyncThunk<PaymentDTO, PaymentVnpayREQ, { rejectValue: string }>(
    'payment/fetch-vnpay-transaction',
    async (body, { rejectWithValue }) => {
        try {
            return await fetchVnpayTransaction(body);
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);
