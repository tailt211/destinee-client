import { createAsyncThunk } from '@reduxjs/toolkit';
import { AccountDTO } from '../../model/account/dto/account.dto';
import { blockPage } from '../home/home.slice';
import { fetchMyAccount } from './account.service';

export const fetchAccountThunk = createAsyncThunk<AccountDTO, {}, { rejectValue: string }>(
    'account/fetch',
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const account = await fetchMyAccount();
            if (!account.upgrade)
                dispatch(
                    blockPage({
                        isBlockCallHistoryPage: true,
                        isBlockFriendPage: true,
                        isBlockMessagePage: true,
                        isLimitCall: true,
                    }),
                );
            return account;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);
