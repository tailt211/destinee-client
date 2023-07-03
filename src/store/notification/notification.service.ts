import { destineeApi } from '../../https';
import { httpExceptionConverter } from '../../model/exception/http-exception.converter';
import { NotificationDTO } from '../../model/notification/dto/notification.dto';
import { NOTIFICATION_TYPE } from '../../model/notification/notification-type';
import { NotificationOverallRESP } from '../../model/notification/response/notification-overall.response';
import { PaginationRESP } from '../../model/pagination.response';

export const fetchNotifications = async (page: number = 1, limit: number = parseInt(process.env.REACT_APP_NOTIFICATION_LIMIT || '15')) => {
    try {
        const data = (await destineeApi.get<PaginationRESP<NotificationOverallRESP>>(`/notifications`, {
            params: { page, limit }
        })).data;
        return {
            notifications: data.results.map((notification) => {
                const { content } = getMessageIdAndContent(notification.data?.content!);
                return {
                    id: notification.id,
                    createdAt: notification.createdAt,
                    isSeen: notification.isSeen,
                    type: NOTIFICATION_TYPE[notification.type],
                    data: notification.data ? {
                        id: notification.data.id,
                        profileId: notification.data.profileId,
                        profileName: notification.data.profileName,
                        content: content,
                        thumbnail: notification.data.thumbnail,
                    } : null
                } as NotificationDTO
            }),
            page: data.page,
            totalCount: data.totalCount,
        }
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi tải thông báo');
    }
};

export const fetchUnseenNotificationsCount = async () => {
    try {
        return (await destineeApi.get<number>(`/notifications/count-unseen`)).data;
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi tải thông báo');
    }
};

export const seenNotifications = async (ids: string[]) => {
    try {
        await destineeApi.patch(`/notifications/seen`, {ids});
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi seen notification');
    }
};

export const archiveNotification = async (ids: string[]) => {
    try {
        await destineeApi.patch(`/notifications/archive`, {ids});
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi seen notification');
    }
};

export const getMessageIdAndContent = (notiContent: string) => {
    const regex = /^([a-zA-Z0-9]{24})\|(.*)$/;
    const group = regex.exec(notiContent);
    return {
        messageId: group ? group[1] : null,
        content: group ? group[2] : notiContent,
    };
}