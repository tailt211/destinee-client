import { destineeApi } from '../../https';
import { httpExceptionConverter } from '../../model/exception/http-exception.converter';
import { MessageOtherProfileDTO } from '../../model/message/dto/message-other-profile.dto';
import { MessageDTO } from '../../model/message/dto/message.dto';
import { MessageCreateREQ } from '../../model/message/request/message-create.request';
import { MessageCreateRESP } from '../../model/message/response/message-create.response';
import { MessageOtherProfileRESP } from '../../model/message/response/message-other-profile.response';
import { MessageRESP } from '../../model/message/response/message.response';
import { PaginationRESP } from '../../model/pagination.response';
import { GENDER } from '../../model/profile/profile.constant';

export const fetchMessages = async (
    conversationId: string,
    page: number = 1,
    limit: number = parseInt(process.env.REACT_APP_MESSAGE_LIMIT || '25'),
) => {
    try {
        const { data } = await destineeApi.get<PaginationRESP<MessageRESP>>(`/messages/${conversationId}`, {
            params: { limit, page },
        });

        return data.results.map(
            (message) =>
                ({
                    id: message.id,
                    content: message.content,
                    createdAt: message.createdAt,
                    isMine: message.isMine,
                } as MessageDTO),
        );
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi tải danh sách tin nhắn');
    }
};

export const sendMessage = async (conversationId: string, body: MessageCreateREQ) => {
    try {
        const { data } = await destineeApi.post<MessageCreateRESP>(`/messages/${conversationId}`, body);
        return { id: data.id, content: body.content };
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi gửi tin nhắn');
    }
};

export const getOtherProfile = async (conversationId: string) => {
    try {
        const { data } = await destineeApi.get<MessageOtherProfileRESP>(`/messages/${conversationId}/other-profile`);
        return {
            id: data.profileId,
            avatar: data.avatar,
            name: data.name,
            gender: data.gender ? GENDER.MALE : GENDER.FEMALE,
            disabled: data.disabled,
        } as MessageOtherProfileDTO;
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra lấy thông tin của đối phương');
    }
};
