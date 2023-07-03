import { destineeApi } from '../../https';
import { CallHistoryDTO } from '../../model/call-history/dto/call-history.dto';
import { CallHistoryOverallRESP } from '../../model/call-history/response/call-history-overall.response';
import { REVIEW } from '../../model/call/review.enum';
import { httpExceptionConverter } from '../../model/exception/http-exception.converter';
import { FriendDTO } from '../../model/friend/dto/friend.dto';
import { FriendRESP } from '../../model/friend/response/friend.response';
import { convertImageRESPtoDTO } from '../../model/image/image.helper';
import { PaginationRESP } from '../../model/pagination.response';
import { MbtiConvertRESPToDTO } from '../../model/personality-test/mbti-convert-response-to-dto';
import { PostOverallDTO } from '../../model/post/dto/post-overall.dto';
import { convertRESPtoOverallDTO } from '../../model/post/post.helper';
import { PostOverallRESP } from '../../model/post/response/post-overall.response';
import { GENDER } from '../../model/profile/profile.constant';

export const fetchFriendProfile = async (id: string) => {
    try {
        const data = (await destineeApi.get<FriendRESP>(`/friends/${id}`)).data;
        return {
            id: data.id,
            name: data.name,
            avatar: data.avatar ? convertImageRESPtoDTO(data.avatar) : null,
            birthdate: data.birthdate,
            origin: data.origin,
            gender: data.gender ? GENDER.MALE : GENDER.FEMALE,
            job: data.job,
            workAt: data.workAt,
            major: data.major,
            hobbies: data.hobbies,
            height: data.height,
            languages: data.languages,
            bio: data.bio,
            mbtiResult: MbtiConvertRESPToDTO(data.mbtiResult),
            conversationId: data.conversationId,
        } as FriendDTO;
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi tải thông tin bạn bè');
    }
};

export const fetchFriendCallHistories = async (id: string, page: number = 1, limit: number = 10) => {
    try {
        const data = (
            await destineeApi.get<PaginationRESP<CallHistoryOverallRESP>>(`/friends/${id}/call-histories`, {
                params: { page, limit },
            })
        ).data;
        return {
            callHistories: data.results.map((history) => ({
                id: history.id,
                your: {
                    rate: history.your.rate,
                    reviews: history.other.reviews.map((review) => REVIEW[review]),
                },
                other: {
                    id: history.other.id,
                    name: history.other.name,
                    rate: history.other.rate,
                    reviews: history.other.reviews.map((review) => REVIEW[review]),
                    avatar: history.other.avatar,
                    gender: history.other.gender ? GENDER.MALE : GENDER.FEMALE,
                },
                compatibility: history.compatibility,
                duration: history.duration,
                createdAt: history.createdAt,
            })) as CallHistoryDTO[],
            page,
        };
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi tải lịch sử cuộc gọi');
    }
};

export const fetchFriendPosts = async (id: string, page: number = 1, limit: number = 10) => {
    try {
        const data = (
            await destineeApi.get<PaginationRESP<PostOverallRESP>>(`/friends/${id}/posts`, {
                params: { page, limit },
            })
        ).data;
        return {
            posts: data.results.map(convertRESPtoOverallDTO),
            page: data.page,
        } as { posts: PostOverallDTO[]; page: number };
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi tải lịch sử cuộc gọi');
    }
};
