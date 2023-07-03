import { createAsyncThunk } from '@reduxjs/toolkit';
import { PersonalityTestHistoryDTO } from '../../model/personality-test/dto/personality-test-history.dto';
import { fetchPersonalityTestHistories } from './personality-test-history.service';

export const fetchPersonalityTestHistoriesThunk = createAsyncThunk<
    PersonalityTestHistoryDTO[],
    undefined,
    { rejectValue: string }
>('personality-test-history/fetch', async (_, { rejectWithValue }) => {
    try {
        return await fetchPersonalityTestHistories();
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});
