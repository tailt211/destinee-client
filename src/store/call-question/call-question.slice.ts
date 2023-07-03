import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CallQuestionDTO } from '../../model/call/dto/call-question.dto';
import { PendingAction, RejectedAction } from '../store-type';
import { fetchQuestions } from './call-question.thunk';

export interface CallQuestionState {
    loading: boolean;
    error?: string;
    isQuestionJustRendered: boolean;
    questionNo: number;
    questions: CallQuestionDTO[];
    currentQuestion: CallQuestionDTO | null;
    timer: number;
    timerCounter: number;
    timeLeft: number;
    secondPerQuestion: number;
    answers: { questionId: string; answerId: string }[];
}

export const initialState: CallQuestionState = {
    loading: false,
    isQuestionJustRendered: true,
    questionNo: 1,
    questions: [],
    currentQuestion: null,

    timer: 0,
    timerCounter: 0,
    timeLeft: 0,
    secondPerQuestion: 0,
    answers: [],
};

export const callQuestionSlice = createSlice({
    name: 'call-question',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = undefined;
        },
        submitAnswer: (state, action: PayloadAction<{ questionId: string; answerId: string }>) => {
            state.answers.push(action.payload);
        },
        nextQuestion: (state) => {
            if (state.questionNo === state.questions.length) {
                state.currentQuestion = initialState.currentQuestion;
            } else {
                ++state.questionNo;
                state.currentQuestion = state.questions[state.questionNo - 1];
                state.timerCounter = initialState.timerCounter;
                state.timer = state.secondPerQuestion;
                state.isQuestionJustRendered = true;
            }
        },
        decreaseTimer: (state) => {
            state.isQuestionJustRendered = false;
            if (state.currentQuestion) {
                state.timerCounter++;
                state.timer = state.secondPerQuestion - state.timerCounter;
            }

            if (state.timerCounter === state.secondPerQuestion) {
                state.timerCounter = initialState.timerCounter;
                state.timer = state.secondPerQuestion;
            }

            if (state.timeLeft > 0) state.timeLeft--;
        },
        resetState: () => initialState,
    },
    extraReducers: (builder) => [
        builder.addCase(fetchQuestions.fulfilled, (state, { payload }) => {
            state.isQuestionJustRendered = true;
            state.questions = payload.questions;
            state.currentQuestion = state.questions[state.questionNo - 1];

            state.secondPerQuestion = payload.secondPerQuestion;
            state.timer = state.secondPerQuestion - state.timerCounter;
            state.timeLeft = state.secondPerQuestion * state.questions.length;
            state.loading = false;
        }),
        builder.addMatcher(
            (action): action is PendingAction => action.type.startsWith('call-question/') && action.type.endsWith('/pending'),
            (state, action) => {
                state.loading = true;
            },
        ),
        builder.addMatcher(
            (action): action is RejectedAction => action.type.startsWith('call-question/') && action.type.endsWith('/rejected'),
            (state, { payload }) => {
                state.loading = false;
                state.error = payload! as string;
            },
        ),
    ],
});

export const { submitAnswer, nextQuestion, decreaseTimer, resetState } = callQuestionSlice.actions;

export default callQuestionSlice.reducer;
