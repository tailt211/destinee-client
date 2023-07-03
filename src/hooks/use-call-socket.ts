import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io, Socket } from 'socket.io-client';
import { CallQuestionAnswerDTO } from '../model/call/dto/call-question-answer.dto';
import { CallAnswerSubmitREQ } from '../model/call/request/call-answer-submit.request';
import { CallPeeringREQ } from '../model/call/request/call-peering.request';
import { CallFindingRESP } from '../model/call/response/call-finding.response';
import { CallInfoRESP } from '../model/call/response/call-info.response';
import { CallPeeringAnswerRESP } from '../model/call/response/call-peering-answer.response';
import { CallQuestionaireAnswerRESP } from '../model/call/response/call-questionaire-answer.response';
import { RequestQuestionaireRESP } from '../model/call/response/request-questionaire.response';
import { MbtiConvertRESPToDTO } from '../model/personality-test/mbti-convert-response-to-dto';
import { GENDER, JOB, LANGUAGE, REGION, SEX } from '../model/profile/profile.constant';
import { QueueFilterDTO } from '../model/queue/dto/queue-filter.dto';
import { queueFilterConverter } from '../model/queue/queue-filter.converter';
import { QueueContinueREQ } from '../model/queue/request/queue-continue.request';
import { QueueFilterREQ } from '../model/queue/request/queue-filter.request';
import { QueueTrendSuggestedFilterRESP } from '../model/queue/response/queue-suggested-filter.response';
import { AppDispatch, RootState } from '../store';
import { AuthState } from '../store/auth/auth.slice';
import {
    questionaireAccepted,
    questionaireFinished,
    questionaireOpponentRequesting,
    questionaireRejected,
    questionaireRequesting,
    resetQuestionaire,
    resetState as resetCallState,
    setError as setCallError,
    setOtherSignal,
    setReadyToCall,
    stopCalling
} from '../store/call/call.slice';
import { startCallingThunk } from '../store/call/call.thunk';
import { setCallCountLeft } from '../store/home/home.slice';
import { ProfileState } from '../store/profile/profile.slice';
import { setError as setQueueError, setFilter, setLoading as setQueueLoading, setQueueEmpty, setSuggestedFilter, startFinding, stopFinding } from '../store/queue/queue.slice';
import {
    CALL_AVAILABLE_ANNOUNCE,
    CALL_END_CALL,
    CALL_FINDING,
    CALL_JOIN_TREND_QUEUE,
    CALL_MATCHED,
    CALL_PEERING,
    CALL_PEERING_ANSWER,
    CALL_QUESTIONAIRE_RESULT,
    CALL_REJECT_QUESTIONAIRE,
    CALL_REQUEST_QUESTIONAIRE,
    CALL_SUBMIT_ANSWER,
    QUEUE_EMPTY_ANNOUNCE,
    QUEUE_TREND_SUGGEST,
    STOP_FINDING,
    WS_EXCEPTION
} from '../utils/gateway-event';
import { GATEWAY_EXCEPTION } from '../utils/gateway-exception-key';

export interface UseCallSocketReturn {
    callSocket?: Socket;
    startFindingCall: (queueFilter: QueueFilterDTO) => Promise<void>;
    continueFindingCall: (queueFilter: QueueFilterDTO, token: string, isNoneChange: boolean) => void;
    stopFindingCall: () => Promise<void>;
    peering: (body: CallPeeringREQ) => void;
    requestQuestionaire: () => void;
    rejectQuestionaire: () => void;
    endCall: () => void;
    submitAnswers: (body: CallAnswerSubmitREQ) => void;
}

export default function useCallSocket({ mainSocket }: { mainSocket?: Socket }): UseCallSocketReturn {
    const { token } = useSelector((state: RootState) => state.auth) as AuthState;
    const { _id: profileId } = useSelector((state: RootState) => state.profile) as ProfileState;
    const [callSocket, setCallSocket] = useState<Socket>();
    const dispatch: AppDispatch = useDispatch();

    /* Initialize Socket */
    useEffect(() => {
        if (!profileId) return;
        console.info('Init call socket...');
        const socket = io(process.env.REACT_APP_SOCKET_URL + '/call', {
            path: process.env.REACT_APP_SOCKET_PATH,
            auth: { Authorization: token },
            transports: ['websocket'],
            upgrade: false,
        });
        setCallSocket(socket);
    }, [profileId, token]);

    useEffect(() => {
        /* Xử lý khi logout */
        if (!token && callSocket) {
            callSocket.disconnect();
        }
    }, [token, callSocket]);

    /* Handle Socket Event */
    useEffect(() => {
        if (!callSocket) return;
        callSocket.on(WS_EXCEPTION, (err: GATEWAY_EXCEPTION) => {
            console.error(err);
            switch (err) {
                case GATEWAY_EXCEPTION.START_FINDING_UNAVAILABLE:
                    dispatch(setCallError('Không thể thực hiện cuộc gọi do đang tìm kiếm hoặc gọi rồi'));
                    break;
                case GATEWAY_EXCEPTION.QUEUE_INVALID_TOKEN:
                    dispatch(setQueueError('QUEUE_INVALID_TOKEN'));
                    break;
                default:
                    break;
            }
        });

        callSocket.on('connect', () => {
            console.info('[Call Socket] Connected', callSocket.id);
            dispatch(setReadyToCall(true));
        });

        callSocket.on('disconnect', () => {
            console.info('[Call Socket] Disconnected', callSocket.id);
            dispatch(resetCallState());
        });

        callSocket.on(CALL_MATCHED, (data: CallInfoRESP) => {
            dispatch(
                startCallingThunk({
                    isInitializer: data.isInitializer,
                    callHistoryId: data.callHistory._id,
                    questions: data.callHistory.questions.map((q) => ({
                        id: q.question,
                        title: q.title,
                        answers: q.answers.map(
                            (a) =>
                                ({
                                    id: a.answer,
                                    title: a.title,
                                } as CallQuestionAnswerDTO),
                        ),
                    })),
                    opponentInfo: {
                        displayName: data.callerInfo.displayName,
                        avatarUrl: data.callerInfo.avatarUrl,
                        personalInfo: {
                            birthdate: data.callerInfo.personalInfo.birthdate,
                            gender: data.callerInfo.personalInfo.gender ? GENDER.MALE : GENDER.FEMALE,
                            sex: data.callerInfo.personalInfo.sex && SEX[data.callerInfo.personalInfo.sex],
                            origin: data.callerInfo.personalInfo.origin && REGION[data.callerInfo.personalInfo.origin],
                            hobbies: data.callerInfo.personalInfo.hobbies,
                            languages:
                                data.callerInfo.personalInfo.languages &&
                                data.callerInfo.personalInfo.languages?.map((lang) => LANGUAGE[lang]),
                            job: data.callerInfo.personalInfo.job && JOB[data.callerInfo.personalInfo.job],
                            workAt: data.callerInfo.personalInfo.workAt,
                            major: data.callerInfo.personalInfo.major,
                            height: data.callerInfo.personalInfo.height,
                            favoriteSongs: data.callerInfo.personalInfo.favoriteSongs,
                            favoriteMovies: data.callerInfo.personalInfo.favoriteMovies,
                        },
                        mbtiResult: MbtiConvertRESPToDTO(data.callerInfo.mbtiResult),
                    },
                    revealAvatars: data.revealAvatars,
                }),
            );
        });

        callSocket.on(CALL_PEERING_ANSWER, (data: CallPeeringAnswerRESP) => {
            dispatch(setOtherSignal(data.signal));
        });

        callSocket.on(CALL_REQUEST_QUESTIONAIRE, (data: RequestQuestionaireRESP) => {
            if (data.callerOne.isRequestedQuestionaire === true && data.callerTwo.isRequestedQuestionaire === true) {
                dispatch(questionaireAccepted());
                return;
            }

            if (data.callerOne.isRequestedQuestionaire === false && data.callerTwo.isRequestedQuestionaire === false) {
                dispatch(questionaireRejected());
                return;
            }

            const opponentRequestState =
                data.callerOne.clientId === callSocket.id
                    ? data.callerTwo.isRequestedQuestionaire
                    : data.callerOne.isRequestedQuestionaire;

            if (opponentRequestState === true) dispatch(questionaireOpponentRequesting());
        });

        callSocket.on(CALL_QUESTIONAIRE_RESULT, (data: CallQuestionaireAnswerRESP) => {
            dispatch(
                questionaireFinished({
                    answers: data.result.questions.map((q) => ({
                        questionId: q.question,
                        yourAnswerId: callSocket.id === data.clientOneId ? q.callerOneAnswerId : q.callerTwoAnswerId,
                        opponentAnswerId: callSocket.id === data.clientOneId ? q.callerTwoAnswerId : q.callerOneAnswerId,
                    })),
                    matchingPercentage: data.result.matchingPercentage,
                }),
            );
        });

        callSocket.on(CALL_END_CALL, () => {
            dispatch(stopCalling());
        });

        callSocket.on(CALL_AVAILABLE_ANNOUNCE, (callCountLeft: number) => {
            dispatch(setReadyToCall(true));
            dispatch(setCallCountLeft(callCountLeft));
        });

        callSocket.on(QUEUE_EMPTY_ANNOUNCE, () => {
            dispatch(setQueueEmpty(true));
        });

        callSocket.on(QUEUE_TREND_SUGGEST, (data: QueueTrendSuggestedFilterRESP) => {
            dispatch(
                setSuggestedFilter({
                    lastFilter: queueFilterConverter(data.lastFilter),
                    trendFilter: queueFilterConverter(data.trendFilter),
                    token: data.token,
                }),
            );
        });

    }, [callSocket, dispatch]);

    const startFindingCall = useCallback(
        (queueFilter: QueueFilterDTO) => {
            return new Promise<void>((res, rej) => {
                dispatch(setQueueLoading(true));
                callSocket?.emit(
                    CALL_FINDING,
                    { ...queueFilter, gender: queueFilter.gender === GENDER.MALE ? true : false } as QueueFilterREQ,
                    async (data: CallFindingRESP | boolean) => {
                        if (!data) {
                            dispatch(setReadyToCall(false));
                            dispatch(setQueueLoading(false));
                            return;
                        }
                        if (typeof data === 'boolean') return;
                        await dispatch(
                            startFinding({
                                queue: data.queue,
                                randomProfiles: data.randomCallerInfoList.map((callerInfo) => {
                                    return {
                                        displayName: callerInfo.displayName,
                                        avatarUrl: callerInfo.avatarUrl,
                                        personalInfo: {
                                            birthdate: callerInfo.personalInfo.birthdate,
                                            gender: callerInfo.personalInfo.gender ? GENDER.MALE : GENDER.FEMALE,
                                            sex: callerInfo.personalInfo.sex && SEX[callerInfo.personalInfo.sex],
                                            origin: callerInfo.personalInfo.origin && REGION[callerInfo.personalInfo.origin],
                                            hobbies: callerInfo.personalInfo.hobbies,
                                            languages:
                                                callerInfo.personalInfo.languages &&
                                                callerInfo.personalInfo.languages?.map((lang) => LANGUAGE[lang]),
                                            job: callerInfo.personalInfo.job && JOB[callerInfo.personalInfo.job],
                                            workAt: callerInfo.personalInfo.workAt,
                                            major: callerInfo.personalInfo.major,
                                            height: callerInfo.personalInfo.height,
                                        },
                                        mbtiResult: MbtiConvertRESPToDTO(callerInfo.mbtiResult),
                                    };
                                }),
                            }),
                        );
                        res();
                    },
                );
            });
        },
        [callSocket, dispatch],
    );

    const continueFindingCall = useCallback(
        (queueFilter: QueueFilterDTO, token: string, isNoneChange: boolean) => {
            callSocket?.emit(CALL_JOIN_TREND_QUEUE, {
                filter: { ...queueFilter, gender: queueFilter.gender === GENDER.MALE ? true : false },
                isNoneChange,
                token,
            } as QueueContinueREQ);
            dispatch(setFilter(queueFilter));
        },
        [callSocket, dispatch],
    );

    const stopFindingCall = useCallback(() => {
        return new Promise<void>((res, rej) => 
        {
            dispatch(setQueueLoading(true));
            callSocket?.emit(STOP_FINDING, (succeed: boolean) => {
                if (!succeed) return;
                dispatch(stopFinding());
                res();
            });
        });
    }, [callSocket, dispatch]);

    const peering = useCallback(
        (body: CallPeeringREQ) => {
            callSocket?.emit(CALL_PEERING, body);
        },
        [callSocket],
    );

    const requestQuestionaire = useCallback(() => {
        callSocket?.emit(CALL_REQUEST_QUESTIONAIRE, (succeed: boolean) => {
            if (!succeed) return;
            dispatch(questionaireRequesting());
        });
    }, [callSocket, dispatch]);

    const rejectQuestionaire = useCallback(() => {
        callSocket?.emit(CALL_REJECT_QUESTIONAIRE, (succeed: boolean) => {
            if (!succeed) return;
            dispatch(resetQuestionaire());
        });
    }, [callSocket, dispatch]);

    const submitAnswers = useCallback(
        (body: CallAnswerSubmitREQ) => {
            callSocket?.emit(CALL_SUBMIT_ANSWER, body, (succeed: boolean) => {});
        },
        [callSocket],
    );

    const endCall = useCallback(() => {
        callSocket?.emit(CALL_END_CALL, (succeed: boolean) => {});
    }, [callSocket]);

    return {
        callSocket,
        startFindingCall,
        continueFindingCall,
        stopFindingCall,
        peering,
        requestQuestionaire,
        rejectQuestionaire,
        endCall,
        submitAnswers,
    };
}
