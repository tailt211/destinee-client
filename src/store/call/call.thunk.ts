import { createAsyncThunk } from '@reduxjs/toolkit';
import { CallQuestionDTO } from '../../model/call/dto/call-question.dto';
import { CallerInfoDTO } from '../../model/call/dto/caller-info.dto';
import { CallReviewREQ } from '../../model/call/request/call-review.request';
import { fetchCallHistoryThunk } from '../call-history/call-history.thunk';
import { reviewCall } from './call.service';

export const finishCallThunk = createAsyncThunk<void, { callHistoryId: string; body: CallReviewREQ }, { rejectValue: string }>(
    'call/finish-call',
    async ({ callHistoryId, body }, { rejectWithValue, dispatch }) => {
        try {
            await reviewCall(callHistoryId, body);
            await dispatch(fetchCallHistoryThunk(body.callerId));
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    },
);

type CallingType = {
    isInitializer: boolean;
    callHistoryId: string;
    opponentInfo: CallerInfoDTO;
    questions: CallQuestionDTO[];
    revealAvatars: string[];
};
export const startCallingThunk = createAsyncThunk<CallingType, CallingType>('call/start-calling', async (params) => {
    return params;
});
