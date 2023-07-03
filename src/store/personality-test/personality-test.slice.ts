import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MBTI_ANSWER } from '../../model/personality-test/mbti-answer.enum';
import { PERSONALITY_TEST_PROCESSING_STATE } from '../../model/personality-test/personality-test-processing-state.enum';
import { PendingAction, RejectedAction } from '../store-type';
import {
    createPersonalityTestThunk,
    fetchPersonalityTestThunk,
    submitAnswerThunk,
} from './personality-test.thunk';

export interface PersonalityTestState {
    loading: boolean;
    submitting: boolean;
    error?: string;
    id: string;
    newTest?: boolean;
    answers: {
        questionId: number;
        answer: MBTI_ANSWER;
    }[];
    noAnswered: number;
    currentIndex: number;
    processingState: PERSONALITY_TEST_PROCESSING_STATE | null;
}

const initialState: PersonalityTestState = {
    id: '',
    loading: false,
    submitting: false,
    answers: [],
    noAnswered: 0,
    currentIndex: 0,
    processingState: null,
};

export const personalityTestSlice = createSlice({
    name: 'personality-test',
    initialState,
    reducers: {
        clearNewTest: (state) => {
            state.newTest = undefined;
        },
        prepareTest: (
            state,
            {
                payload,
            }: PayloadAction<{
                id: string;
                numberOfAnswers: number;
                processingState: PERSONALITY_TEST_PROCESSING_STATE;
            }>,
        ) => {
            state.id = payload.id;
            state.noAnswered = payload.numberOfAnswers;
            state.currentIndex = payload.numberOfAnswers;
            state.processingState = payload.processingState;
        },
        resetState: () => initialState,
        undoQuestion: (state) => {
            if (state.currentIndex > 0) state.currentIndex--;
        },
        nextQuestion: (state) => {
            if (state.currentIndex < state.noAnswered) state.currentIndex++;
        },
        setLoading: (state, { payload }: PayloadAction<boolean>) => {
            state.loading = payload;
        },
    },
    extraReducers: (builder) => [
        builder.addCase(fetchPersonalityTestThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.answers = payload.answers;
            if (!state.id || state.newTest) {
                state.id = payload.id;
                state.noAnswered = payload.numberOfAnswers;
                state.currentIndex = payload.numberOfAnswers;
                state.processingState = payload.processingState;
                state.newTest = false;
            }
        }),
        builder.addCase(createPersonalityTestThunk.pending, (state, { payload }) => {
            state.newTest = true;
        }),
        builder.addCase(createPersonalityTestThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
        }),
        builder.addCase(submitAnswerThunk.fulfilled, (state, { payload }) => {
            state.submitting = false;
            if (payload.questionId <= state.noAnswered)
                state.answers[payload.questionId - 1].answer = payload.answer;
            else {
                state.answers.push(payload);
                state.noAnswered++;
            }
            state.currentIndex++;
        }),
        builder.addCase(submitAnswerThunk.pending, (state, { payload }) => {
            state.submitting = true;
        }),
        builder.addMatcher(
            (action): action is PendingAction =>
                action.type.startsWith('personality-test/') &&
                action.type.endsWith('/pending') &&
                !action.type.includes('submit-answer'),
            (state, action) => {
                state.loading = true;
            },
        ),
        builder.addMatcher(
            (action): action is RejectedAction =>
                action.type.startsWith('personality-test/') &&
                action.type.endsWith('/rejected'),
            (state, { payload }) => {
                state.loading = false;
                state.submitting = false;
                state.error = payload! as string;
            },
        ),
    ],
});

export const { prepareTest, resetState, undoQuestion, nextQuestion, setLoading, clearNewTest} =
    personalityTestSlice.actions;

export default personalityTestSlice.reducer;
