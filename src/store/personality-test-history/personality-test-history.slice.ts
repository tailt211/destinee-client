import { createSlice } from '@reduxjs/toolkit';
import { PersonalityTestHistoryDTO } from '../../model/personality-test/dto/personality-test-history.dto';
import { PendingAction, RejectedAction } from '../store-type';
import { PERSONALITY_TEST_PROCESSING_STATE } from './../../model/personality-test/personality-test-processing-state.enum';
import { fetchPersonalityTestHistoriesThunk } from './personality-test-history.thunk';

export interface PersonalityTestHistoryState {
    loading: boolean;
    error?: string;
    testHistories: PersonalityTestHistoryDTO[];
    processingState: PERSONALITY_TEST_PROCESSING_STATE | null;
}

const initialState: PersonalityTestHistoryState = {
    loading: true,
    testHistories: [],
    processingState: null,
};

export const personalityTestHistorySlice = createSlice({
    name: 'personality-test-history',
    initialState,
    reducers: {
        resetState: () => initialState,
    },
    extraReducers: (builder) => [
        builder.addCase(fetchPersonalityTestHistoriesThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.testHistories = payload;
        }),
        builder.addMatcher(
            (action): action is PendingAction =>
                action.type.startsWith('personality-test-history/') && action.type.endsWith('/pending'),
            (state, action) => {
                state.loading = true;
            },
        ),
        builder.addMatcher(
            (action): action is RejectedAction =>
                action.type.startsWith('personality-test-history/') && action.type.endsWith('/rejected'),
            (state, { payload }) => {
                state.loading = false;
                state.error = payload! as string;
            },
        ),
    ],
});

export const { resetState } = personalityTestHistorySlice.actions;
export default personalityTestHistorySlice.reducer;
