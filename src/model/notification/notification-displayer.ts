import { callOutline, chatboxEllipsesOutline } from 'ionicons/icons';
import destineeLogo from '../../assets/destinee-logo.png';
import { NOTIFICATION_TYPE } from './notification-type';

export const notificationDisplayer: { [key in NOTIFICATION_TYPE]: { message: string; avatar?: string; icon?: string } } = {
    ANONYMOUS_CALL: { message: 'Người cùng bạn trò chuyện trước đây đã gọi nhỡ cho bạn', icon: callOutline },
    ANONYMOUS_MESSAGE: { message: 'Người cùng bạn trò chuyện trước đây đã nhắn cho bạn', icon: chatboxEllipsesOutline },
    DIRECT_CALL: { message: 'đã gọi nhỡ' },
    DIRECT_MESSAGE: { message: 'đã nhắn tin cho bạn' },
    FRIEND_REQUEST: { message: 'gửi cho bạn một yêu cầu kết bạn' },
    FRIEND_REQUEST_ACCEPTED: { message: 'đã chấp nhận lời mời kết bạn' },
    REPORT_HANDLED: { message: 'Quản trị viên đã xử lý báo cáo vi phạm của bạn', avatar: destineeLogo },
};
