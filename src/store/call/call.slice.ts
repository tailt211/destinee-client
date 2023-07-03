import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Peer from 'simple-peer';
import { CallQuestionDTO } from '../../model/call/dto/call-question.dto';
import { CallQuestionaireAnswerDTO } from '../../model/call/dto/call-questionaire-answer.dto';
import { CallerInfoDTO } from '../../model/call/dto/caller-info.dto';
import { PendingAction, RejectedAction } from '../store-type';
import { finishCallThunk, startCallingThunk } from './call.thunk';

export type CallState = {
    loading: boolean;
    error?: string;
    timer: number;
    isReady: boolean;
    isInitializer: boolean;
    isMuted: boolean;
    otherSignal?: Peer.SignalData;
    isCalling: boolean;
    isCallEnded: boolean;
    revealAvatars?: string[];
    opponentInfo?: CallerInfoDTO;
    callHistoryId?: string;
    questions?: CallQuestionDTO[];
    questionaire: {
        isRequesting: boolean;
        isOpponentRequesting: boolean;
        isAccepted: boolean | null;
        answers?: CallQuestionaireAnswerDTO[];
        matchingPercentage?: number;
    };
};

export const initialState: CallState = {
    loading: false,
    timer: 0,
    isReady: false,
    isInitializer: false,
    isMuted: true,
    isCalling: false,
    isCallEnded: false,
    questionaire: {
        isRequesting: false,
        isOpponentRequesting: false,
        isAccepted: null,
    },
};

export const callSlice = createSlice({
    name: 'call',
    initialState,
    reducers: {
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = undefined;
        },
        increaseTimer: (state) => {
            state.timer = state.timer + 1;
        },
        setReadyToCall: (state, action: PayloadAction<boolean>) => {
            state.loading = false;
            state.isReady = action.payload;
        },
        stopCalling: (state) => {
            state.isCallEnded = true;
        },
        setMute: (state, action: PayloadAction<boolean>) => {
            state.isMuted = action.payload;
        },
        setOtherSignal: (state, action: PayloadAction<Peer.SignalData>) => {
            state.otherSignal = action.payload;
        },
        questionaireRequesting: (state) => {
            state.questionaire.isRequesting = true;
        },
        questionaireOpponentRequesting: (state) => {
            state.questionaire.isOpponentRequesting = true;
        },
        questionaireAccepted: (state) => {
            // state.questionaire.isRequesting = false;
            // state.questionaire.isOpponentRequesting = false;
            state.questionaire.isAccepted = true;
        },
        questionaireRejected: (state) => {
            // state.questionaire.isRequesting = false;
            // state.questionaire.isOpponentRequesting = false;
            state.questionaire.isAccepted = false;
        },
        questionaireFinished: (
            state,
            action: PayloadAction<{
                answers: CallQuestionaireAnswerDTO[];
                matchingPercentage: number;
            }>,
        ) => {
            state.questionaire.answers = action.payload.answers;
            state.questionaire.matchingPercentage = action.payload.matchingPercentage;
            state.isMuted = false;
        },
        resetQuestionaire: (state) => {
            state.questionaire = {
                isRequesting: false,
                isOpponentRequesting: false,
                isAccepted: null,
                answers: undefined,
            };
        },
        resetState: () => initialState,
    },
    extraReducers: (builder) => [
        builder.addCase(finishCallThunk.fulfilled, () => ({
            ...initialState,
            isReady: true,
        })),
        builder.addCase(startCallingThunk.fulfilled, (state, { payload }) => {
            state.isCalling = true;
            state.isInitializer = payload.isInitializer;
            state.callHistoryId = payload.callHistoryId;
            state.opponentInfo = payload.opponentInfo;
            state.questions = payload.questions;
            state.revealAvatars = payload.revealAvatars;
        }),
        builder.addMatcher(
            (action): action is PendingAction =>
                action.type.startsWith('call/') && action.type.endsWith('/pending') && !action.type.includes('start-calling'),
            (state, action) => {
                state.loading = true;
            },
        ),
        builder.addMatcher(
            (action): action is RejectedAction => action.type.startsWith('call/') && action.type.endsWith('/rejected'),
            (state, { payload }) => {
                state.loading = false;
                state.error = payload! as string;
            },
        ),
    ],
});

export const {
    setError,
    clearError,
    increaseTimer,
    setReadyToCall,
    stopCalling,
    setMute,
    setOtherSignal,
    questionaireRequesting,
    questionaireOpponentRequesting,
    questionaireRejected,
    questionaireAccepted,
    questionaireFinished,
    resetQuestionaire,
    resetState,
} = callSlice.actions;

export default callSlice.reducer;
