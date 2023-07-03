import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '..';
import { CallQuestionDTO } from '../../model/call/dto/call-question.dto';
import { CallState } from '../call/call.slice';

export const fetchQuestions = createAsyncThunk<
    {
        secondPerQuestion: number;
        questions: CallQuestionDTO[];
    },
    undefined,
    { rejectValue: string }
>('call-question/fetch-questions', async (_, { getState, rejectWithValue }) => {
    const { questions } = (getState() as RootState).call as CallState;
    if (!questions) {
        return rejectWithValue("Can't fetch empty question from call question");
    }
    return {
        secondPerQuestion: parseInt(process.env.REACT_APP_DURATION_PER_CALL_QUESTION!),
        questions: questions,
    };
});
