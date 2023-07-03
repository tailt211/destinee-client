import { createAsyncThunk } from '@reduxjs/toolkit';
import { generatePremiumOrder } from './order.service';

export const generatePremiumOrderThunk = createAsyncThunk<string, void, { rejectValue: string }>(
    'order/gererate-premium',
    async (_, { rejectWithValue }) => {
        try {
            return await generatePremiumOrder();
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);
