import { destineeApi } from '../../https';
import { httpExceptionConverter } from '../../model/exception/http-exception.converter';
import { FriendDTO } from '../../model/friend/dto/friend.dto';
import { FriendRESP } from '../../model/friend/response/friend.response';
import { convertImageRESPtoDTO } from '../../model/image/image.helper';
import { PaginationRESP } from '../../model/pagination.response';
import { MbtiConvertRESPToDTO } from '../../model/personality-test/mbti-convert-response-to-dto';
import { GENDER } from '../../model/profile/profile.constant';

export const fetchFriends = async (search?: string, page: number = 1, limit: number = 10) => {
    try {
        const data = (
            await destineeApi.get<PaginationRESP<FriendRESP>>(`/friends`, {
                params: { q: search, page, limit },
            })
        ).data;
        return {
            friends: data.results.map(
                (friend) =>
                    ({
                        id: friend.id,
                        name: friend.name,
                        avatar: friend.avatar ? convertImageRESPtoDTO(friend.avatar) : null,
                        birthdate: friend.birthdate,
                        origin: friend.origin,
                        gender: friend.gender ? GENDER.MALE : GENDER.FEMALE,
                        job: friend.job,
                        workAt: friend.workAt,
                        major: friend.major,
                        hobbies: friend.hobbies,
                        bio: friend.bio,
                        mbtiResult: MbtiConvertRESPToDTO(friend.mbtiResult),
                    } as FriendDTO),
            ),
            page: data.page,
            totalCount: data.totalCount,
        };
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi tải danh sách bạn bè');
    }
};
