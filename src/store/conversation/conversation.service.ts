import { destineeApi } from '../../https';
import { ConversationDTO } from '../../model/conversation/dto/conversation.dto';
import { ConversationCreateREQ } from '../../model/conversation/request/conversation-create.request';
import { ConversationCreateRESP } from '../../model/conversation/response/conversation-create.response';
import { ConversationRESP } from '../../model/conversation/response/conversation.response';
import { httpExceptionConverter } from '../../model/exception/http-exception.converter';
import { PaginationRESP } from '../../model/pagination.response';
import { GENDER } from '../../model/profile/profile.constant';

export const fetchConversations = async (page: number = 1, limit: number = 15) => {
    try {
        const { data } = await destineeApi.get<PaginationRESP<ConversationRESP>>(`/messages`, { params: { limit, page } });
        return {
            conversations: data.results.map((conversation) => {
                return {
                    id: conversation.id,
                    isSeen: conversation.isSeen,
                    lastMessage: conversation.lastMessage,
                    other: {
                        profileId: conversation.other.profileId,
                        avatar: conversation.other.avatar,
                        name: conversation.other.name,
                        gender: conversation.other.gender ? GENDER.MALE : GENDER.FEMALE,
                        disabled: conversation.other.disabled
                    },
                    lastMessageAt: conversation.lastMessageAt,
                } as ConversationDTO;
            }),
            page,
        };
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi tải danh sách cuộc trò chuyện');
    }
};

export const createConversation = async (body: ConversationCreateREQ) => {
    try {
        const { data } = await destineeApi.post<ConversationCreateRESP>(`/messages`, body);
        return data.id;
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi tạo cuộc trò chuyện');
    }
};

export const seenConversation = async (conversationId: string) => {
    try {
        await destineeApi.post(`/messages/${conversationId}/seen`);
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi thay đổi trạng thái cuộc trò chuyện');
    }
};
