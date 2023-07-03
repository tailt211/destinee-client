import { destineeApi } from '../../https';
import { httpExceptionConverter } from '../../model/exception/http-exception.converter';
import { FriendRequestCreate } from '../../model/friend-request/dto/friend-request-create.dto';
import { FriendRequestVerify } from '../../model/friend-request/dto/friend-request-verify.dto';
import { FriendRequestDTO } from '../../model/friend-request/dto/friend-request.dto';
import { FRIEND_REQUEST_STATUS } from '../../model/friend-request/friend-request-status.enum';
import { CreateFriendRequestREQ } from '../../model/friend-request/request/friend-request-create.request';
import { UnfriendRequestREQ } from '../../model/friend-request/request/friend-request-unfriend.request';
import { VerifyFriendRequestREQ } from '../../model/friend-request/request/friend-request-verify.request';
import { FriendRequestCreateRESP } from '../../model/friend-request/response/friend-request-create.response';
import { FriendRequestRESP } from '../../model/friend-request/response/friend-request.response';
import { PaginationRESP } from '../../model/pagination.response';
import { MbtiConvertRESPToDTO } from '../../model/personality-test/mbti-convert-response-to-dto';
import { GENDER } from '../../model/profile/profile.constant';

export const createFriendRequest = async (body: CreateFriendRequestREQ) => {
    try {
        const { data } = await destineeApi.post<FriendRequestCreateRESP>(`/friend-requests`, body);
        return {
            id: data._id,
            requesterId: data.requester._id,
            verifierId: data.verifier._id,
            status: FRIEND_REQUEST_STATUS[data.status],
        } as FriendRequestCreate;
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi gửi lời mời kết bạn');
    }
};

export const fetchFriendRequests = async (page: number = 1, limit: number = 10) => {
    try {
        const { data } = await destineeApi.get<PaginationRESP<FriendRequestRESP>>(`/friend-requests`, {
            params: { limit, page },
        });

        return {
            friendRequests: data.results.map((request) => {
                return {
                    id: request.id,
                    createdAt: request.createdAt,
                    profileId: request.profileId,
                    name: request.name,
                    avatar: request.avatar,
                    gender: request.gender ? GENDER.MALE : GENDER.FEMALE,
                    mbtiResult: MbtiConvertRESPToDTO(request.mbtiResult),
                    compatibility: request.compatibility,
                } as FriendRequestDTO;
            }),
            totalCount: data.totalCount,
            page,
        };
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi tải danh sách lời mời kết bạn');
    }
};

export const verifyFriendRequest = async (body: VerifyFriendRequestREQ) => {
    try {
        await destineeApi.post(`/friend-requests/verify`, body);
        return {
            isAccept: body.isAccept,
            profileId: body.profileId,
        } as FriendRequestVerify;
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi xác nhận lời mời kết bạn');
    }
};

export const unfriendRequest = async (body: UnfriendRequestREQ) => {
    try {
        await destineeApi.post(`/friend-requests/unfriend`, body);
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi hủy kết bạn');
    }
};

export const fetchFriendRequest = async (id?: string) => {
    try {
        const data = await (await destineeApi.get<FriendRequestRESP>(`/friend-requests/${id}`)).data;
        return {
            id: data.id,
            createdAt: data.createdAt,
            profileId: data.profileId,
            name: data.name,
            avatar: data.avatar,
            gender: data.gender ? GENDER.MALE : GENDER.FEMALE,
            mbtiResult: MbtiConvertRESPToDTO(data.mbtiResult),
            compatibility: data.compatibility,
        } as FriendRequestDTO;
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi tải thông tin lời mời kết bạn');
    }
};
