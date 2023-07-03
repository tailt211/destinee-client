import { destineeApi } from '../../https';
import { CallHistoryDTO } from '../../model/call-history/dto/call-history.dto';
import { CallHistoryOverallRESP } from '../../model/call-history/response/call-history-overall.response';
import { REVIEW } from '../../model/call/review.enum';
import { httpExceptionConverter } from '../../model/exception/http-exception.converter';
import { PaginationRESP } from '../../model/pagination.response';
import { MbtiConvertRESPToDTO } from '../../model/personality-test/mbti-convert-response-to-dto';
import { GENDER } from '../../model/profile/profile.constant';

export const fetchHistoryCall = async (id: string, page: number = 1, limit: number = 10) => {
    try {
        const data = (
            await destineeApi.get<PaginationRESP<CallHistoryOverallRESP>>(`/call-histories`, { params: { limit, page } })
        ).data;
        return {
            callHistories: data.results.map((history) => {
                return {
                    id: history.id,
                    your: {
                        rate: history.your.rate,
                        reviews: history.your?.reviews?.map((review) => REVIEW[review]),
                    },
                    other: {
                        id: history.other.id,
                        name: history.other.name,
                        rate: history.other.rate,
                        reviews: history.other?.reviews?.map((review) => REVIEW[review]),
                        avatar: history.other.avatar,
                        gender: history.other.gender ? GENDER.MALE : GENDER.FEMALE,
                        mbtiResult: MbtiConvertRESPToDTO(history.other.mbtiResult),
                        disabled: history.other.disabled,
                    },
                    compatibility: history.compatibility,
                    duration: history.duration,
                    createdAt: history.createdAt,
                    friendRequest: {
                        requester: history.friendRequest?.requester,
                        verifier: history.friendRequest?.verifier,
                        status: history.friendRequest?.status,
                    },
                    conversationId: history.conversationId,
                } as CallHistoryDTO;
            }),
            page,
        };
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi tải lịch sử cuộc gọi');
    }
};
