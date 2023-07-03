import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CallerInfoDTO } from '../../model/call/dto/caller-info.dto';
import { GENDER } from '../../model/profile/profile.constant';
import { QueueFilterDTO } from '../../model/queue/dto/queue-filter.dto';
import { RejectedAction } from '../store-type';

export type QueueState = {
    loading: boolean;
    error?: string;
    isFinding: boolean;
    isQueueEmpty?: boolean;
    queue?: number;
    randomProfiles?: CallerInfoDTO[];
    filter: QueueFilterDTO;
    suggestedFilter?: QueueFilterDTO;
    continueToken?: string;
};

const initFilter = {
    gender: GENDER.MALE,
    ageRange: [parseInt(process.env.REACT_APP_PROFILE_MIN_AGE!), parseInt(process.env.REACT_APP_PROFILE_MAX_AGE!)] as [number, number],
    language: null,
    origin: null,
    sex: null,
    topic: null,
};

export const initialState: QueueState = {
    loading: false,
    isFinding: false,
    filter: initFilter,
};

export const queueSlice = createSlice({
    name: 'queue',
    initialState,
    reducers: {
        setLoading: (state, { payload }: PayloadAction<boolean>) => {
            state.loading = payload;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = undefined;
        },
        startFinding: (state, action: PayloadAction<{ queue: number; randomProfiles: CallerInfoDTO[] }>) => {
            state.loading = false;
            state.isFinding = true;
            state.queue = action.payload.queue;
            state.randomProfiles = action.payload.randomProfiles;
        },
        stopFinding: (state) => ({
            ...initialState,
            filter: state.filter,
        }),
        setQueueEmpty: (state, { payload }: PayloadAction<boolean | undefined>) => {
            state.isQueueEmpty = payload;
        },
        setFilter: (state, { payload }: PayloadAction<Partial<QueueFilterDTO>>) => {
            state.filter = { ...state.filter, ...payload };
            state.suggestedFilter = undefined;
            state.continueToken = undefined;
        },
        setSuggestedFilter: (state, { payload }: PayloadAction<{ lastFilter: QueueFilterDTO; trendFilter: QueueFilterDTO; token: string }>) => {
            state.suggestedFilter = payload.trendFilter;
            state.filter = payload.lastFilter;
            state.continueToken = payload.token;
        },
        customFilter: (state, { payload }: PayloadAction<QueueFilterDTO>) => {
            state.filter = payload;
            state.isFinding = false;
            state.suggestedFilter = undefined;
            state.continueToken = undefined;
        },
        resetState: () => initialState,
    },
    extraReducers: (builder) => [
        // builder.addMatcher(
        //     (action): action is PendingAction => action.type.startsWith('queue/') && action.type.endsWith('/pending'),
        //     (state, action) => {
        //         state.loading = true;
        //     },
        // ),
        builder.addMatcher(
            (action): action is RejectedAction => action.type.startsWith('queue/') && action.type.endsWith('/rejected'),
            (state, { payload }) => {
                state.loading = false;
                state.error = payload! as string;
            },
        ),
    ],
});

export const {
    setLoading,
    setError,
    clearError,
    startFinding,
    stopFinding,
    setQueueEmpty,
    setFilter,
    setSuggestedFilter,
    customFilter,
    resetState,
} = queueSlice.actions;

export default queueSlice.reducer;
