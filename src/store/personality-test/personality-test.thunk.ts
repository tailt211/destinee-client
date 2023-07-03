import { createAsyncThunk } from '@reduxjs/toolkit';
import { PersonalityTestCreateDTO } from '../../model/personality-test/dto/personality-test-create.dto';
import { PersonalityTestDTO } from '../../model/personality-test/dto/personality-test.dto';
import { MBTI_ANSWER } from '../../model/personality-test/mbti-answer.enum';
import { PersonalityTestSubmitREQ } from '../../model/personality-test/request/personality-test-submit.request';
import {
    createPersonalityTest,
    fetchPersonalityTest,
    submitPersonalityAnswerTest,
} from './personality-test.service';

export const fetchPersonalityTestThunk = createAsyncThunk<
    PersonalityTestDTO,
    string,
    { rejectValue: string }
>('personality-test/fetch', async (id, { rejectWithValue }) => {
    try {
        return await fetchPersonalityTest(id);
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const submitAnswerThunk = createAsyncThunk<
    { questionId: number; answer: MBTI_ANSWER },
    { id: string; body: PersonalityTestSubmitREQ },
    { rejectValue: string }
>('personality-test/submit-answer', async ({ id, body }, { rejectWithValue }) => {
    try {
        await submitPersonalityAnswerTest(id, body);
        return body;
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});

export const createPersonalityTestThunk = createAsyncThunk<
    PersonalityTestCreateDTO,
    undefined,
    { rejectValue: string }
>('personality-test/create', async (_, { rejectWithValue }) => {
    try {
        return await createPersonalityTest();
    } catch (err: any) {
        return rejectWithValue(err.message);
    }
});