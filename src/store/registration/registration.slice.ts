import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { isUndefined, omitBy } from 'lodash';
import { GENDER } from '../../model/profile/profile.constant';
import { RegistrationAnswerDTO } from '../../model/registration/dto/registration-answer.dto';
import { PendingAction, RejectedAction } from '../store-type';
import { fetchRegistrationThunk, registerThunk, submitAnswerThunk, uploadAvatarThunk } from './registration.thunk';

export interface RegistrationState {
    loading: boolean;
    submitting: boolean;
    processing: boolean;
    error?: string;
    firebaseError?: string;
    answer: RegistrationAnswerDTO;
    isFinished: boolean;
    noAnswered: number;
    currentIndex: number;
}

const initialState: RegistrationState = {
    loading: false,
    submitting: false,
    processing: false,
    answer: {},
    noAnswered: 0,
    currentIndex: 0,
    isFinished: true,
};

export const registrationSlice = createSlice({
    name: 'registration',
    initialState,
    reducers: {
        resetState: () => initialState,
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        undoQuestion: (state) => {
            state.loading = true;
            if (state.currentIndex > 0) state.currentIndex--;
        },
        nextQuestion: (state) => {
            state.loading = true;
            if (state.currentIndex < state.noAnswered) state.currentIndex++;
            else state.loading = false;
        },
        clearError: (state) => {
            state.error = undefined;
            state.firebaseError = undefined;
        },
    },
    extraReducers: (builder) => [
        builder.addCase(fetchRegistrationThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.processing = true;
            state.isFinished = payload.isFinished;
            state.answer = payload.answer;
            const noAnswered = Object.keys(omitBy(payload.answer, isUndefined)).length;
            state.noAnswered = noAnswered;
            state.currentIndex = noAnswered;
        }),
        builder.addCase(registerThunk.rejected, (state, { payload }) => {
            state.loading = false;
            state.firebaseError = payload! as string;
        }),
        builder.addCase(registerThunk.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.isFinished = payload.isFinished;
            state.processing = true;
            state.firebaseError = undefined;
            state.error = undefined;
        }),
        builder.addCase(submitAnswerThunk.fulfilled, (state, { payload }) => {
            state.loading = true;
            state.submitting = false;
            const answer = {
                ...state.answer,
                [payload.submission.answerKey]:
                    payload.submission.answerKey !== 'gender'
                        ? payload.submission.value
                        : payload.submission.value
                        ? GENDER.MALE
                        : GENDER.FEMALE,
            };
            state.answer = answer;
            state.noAnswered = Object.keys(omitBy(answer, isUndefined)).length;
            state.isFinished = payload.isFinished;
            if (!payload.isFinished) state.currentIndex = state.currentIndex + 1;
        }),
        builder.addCase(submitAnswerThunk.pending, (state) => {
            state.submitting = true;
        }),
        builder.addCase(uploadAvatarThunk.pending, (state) => {
            state.submitting = true;
        }),
        builder.addCase(uploadAvatarThunk.fulfilled, (state, { payload }) => {
            state.loading = true;
            state.submitting = false;
            const answer = {
                ...state.answer,
                avatar: payload.avatar,
            };
            state.answer = answer;
            state.noAnswered = Object.keys(omitBy(answer, isUndefined)).length;
            state.isFinished = payload.isFinished;
            if (!payload.isFinished) state.currentIndex = state.currentIndex + 1;
        }),
        builder.addMatcher(
            (action): action is PendingAction =>
                action.type.startsWith('registration/') &&
                action.type.endsWith('/pending') &&
                !action.type.includes('submit-answer'),
            (state, action) => {
                state.loading = true;
            },
        ),
        builder.addMatcher(
            (action): action is RejectedAction =>
                action.type.startsWith('registration/') && action.type.endsWith('/rejected') && !action.type.includes('register'),
            (state, { payload }) => {
                state.loading = false;
                state.submitting = false;
                state.error = payload! as string;
            },
        ),
    ],
});

export const { resetState, undoQuestion, nextQuestion, clearError, setLoading } = registrationSlice.actions;

export default registrationSlice.reducer;
