/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/9.8.3/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.8.3/firebase-messaging-compat.js');

if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('../firebase-messaging-sw.js')
        .then((reg) => console.log('Registration successful, scope is:', reg.scope))
        .catch((err) => console.log('Service worker registration failed, error:', err));
} else {
    console.warn('Không hỗ trợ service worker');
}

firebase.initializeApp({
    apiKey: 'AIzaSyDhSYI7vbmX5ciPSQ6LC3fXJy4L5xiMAIQ',
    authDomain: 'destinee-bf58a.firebaseapp.com',
    projectId: 'destinee-bf58a',
    storageBucket: 'destinee-bf58a.appspot.com',
    messagingSenderId: '239374623385',
    appId: '1:239374623385:web:cfe23a2c79e461299b0e08',
    measurementId: 'G-0G6TBRV0V7',
});

const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
    // console.log('[firebase-messaging-sw.js] Background message ', payload);
    const { id, isSeen, type, data } = fcmPayload = parseFcmPayload(payload);
    const notiDisplayer = getNotificationDisplayer(type, data);
    const notificationTitle = notiDisplayer.title;
    const notificationOptions = {
        body: notiDisplayer.body,
        icon: notiDisplayer.icon,
        vibrate: [200, 100, 200, 100, 200, 100, 200],
        data: fcmPayload,
    };
    return self.registration.showNotification(notificationTitle, notificationOptions);
    // Mở thằng này thì nó display notification 2 lần
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();
    console.log('notificationclick', event);
    const { id, isSeen, type, data } = event.notification.data;
    switch (type) {
        case NOTIFICATION_TYPE.FRIEND_REQUEST:
            event.waitUntil(self.clients.openWindow(`friend-request/${data.id}`));
            break;
        case NOTIFICATION_TYPE.FRIEND_REQUEST_ACCEPTED:
            event.waitUntil(self.clients.openWindow(`friend/${data.profileId}${slugGenerator(data.profileName)}`));
            break;
        case NOTIFICATION_TYPE.DIRECT_MESSAGE:
            event.waitUntil(self.clients.openWindow(`direct/${data.data.id}`));
            break;
        case NOTIFICATION_TYPE.ANONYMOUS_MESSAGE:
            event.waitUntil(self.clients.openWindow(`tabs/message`));
            break;
        case NOTIFICATION_TYPE.DIRECT_CALL:
            event.waitUntil(self.clients.openWindow(`tabs/call-history`));
            break;
        case NOTIFICATION_TYPE.ANONYMOUS_CALL:
            event.waitUntil(self.clients.openWindow(`tabs/call-history`));
            break;
        default:
            break;
    }
});

/* 
    =============== Handler ==================
*/
const NOTIFICATION_TYPE = {
    DIRECT_CALL: 'DIRECT_CALL',
    ANONYMOUS_MESSAGE: 'ANONYMOUS_MESSAGE',
    ANONYMOUS_CALL: 'ANONYMOUS_CALL',
    DIRECT_MESSAGE: 'DIRECT_MESSAGE',
    FRIEND_REQUEST: 'FRIEND_REQUEST',
    FRIEND_REQUEST_ACCEPTED: 'FRIEND_REQUEST_ACCEPTED',
    REPORT_HANDLED: 'REPORT_HANDLED',
};

function getNotificationDisplayer(type, data) {
    switch (type) {
        case NOTIFICATION_TYPE.FRIEND_REQUEST:
            return {
                title: `[Destinee] Lời mời kết bạn mới`,
                body: `${data.profileName} có nhã ý muốn hiểu thêm về bạn đó`,
                icon: data.thumbnail,
            }
        case NOTIFICATION_TYPE.FRIEND_REQUEST_ACCEPTED:
            return {
                title: `[Destinee] Kết bạn thành công`,
                body: `${data.profileName} đã chấp nhập lời mời kết bạn của bạn`,
                icon: data.thumbnail,
            }
        case NOTIFICATION_TYPE.DIRECT_MESSAGE:
            const { content, messageId } = getMessageIdAndContent(data.content);
            return {
                title: `[Destinee] Tin nhắn từ ${data.profileName}`,
                body: content,
                icon: data.thumbnail,
            }
        case NOTIFICATION_TYPE.DIRECT_CALL:
            return {
                title: `[Destinee] Gọi nhỡ từ ${data.profileName}`,
                body: `Có vẻ như ${data.profileName} đang có tâm sự muốn sẻ chia cùng bạn`,
                icon: data.thumbnail,
            }
        case NOTIFICATION_TYPE.ANONYMOUS_MESSAGE:
            return {
                title: `[Destinee] Tin nhắn mới`,
                body: `Người đã cùng bạn trò chuyện trong cuộc gọi trước đây đang cố gắng liên lạc với bạn đấy`,
                icon: 'https://destinee.dev/assets/icon/icon-192x192.png',
            }
        case NOTIFICATION_TYPE.ANONYMOUS_CALL:
            return {
                title: `[Destinee] Gọi nhỡ`,
                body: `Người đã cùng bạn trò chuyện trong cuộc gọi trước đây đang cố gắng liên lạc với bạn đấy`,
                icon: 'https://destinee.dev/assets/icon/icon-192x192.png',
            }
        case NOTIFICATION_TYPE.REPORT_HANDLED:
            return {
                title: `[Destinee] Giải quyết báo cáo vi phạm`,
                body: `Báo cáo vi phạm của bạn đến với cá nhân xyz đã được xem xét và phản hồi`,
                icon: 'https://destinee.dev/assets/icon/icon-192x192.png',
            }
        default:
            return { title: 'Invalid notification from FCM', body: "Can't identify notification type" }
    }
}

function parseFcmPayload(payload) {
    const id = payload.data.id;
    const isSeen = payload.data.isSeen === 'true' ? true : false;
    const type = payload.data.type;
    const data = {
        id: payload.data['data.id'] === '' ? undefined : payload.data['data.id'],
        profileId: payload.data['data.profileId'] === '' ? undefined : payload.data['data.profileId'],
        profileName: payload.data['data.profileName'] === '' ? undefined : payload.data['data.profileName'],
        content: payload.data['data.content'] === '' ? undefined : payload.data['data.content'],
        thumbnail: payload.data['data.thumbnail'] === '' ? undefined : payload.data['data.thumbnail'],
    };
    return { id, isSeen, type, data };
}

function getMessageIdAndContent(notiContent) {
    const regex = /^([a-zA-Z0-9]{24})\|(.*)$/;
    const group = regex.exec(notiContent);
    return {
        messageId: group ? group[1] : null,
        content: group ? group[2] : notiContent,
    };
}

function viVN_to_enUS(str) {
    //Đổi chữ hoa thành chữ thường
    str = str.toLowerCase();

    //Đổi ký tự có dấu thành không dấu
    str = str.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
    str = str.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
    str = str.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
    str = str.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
    str = str.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
    str = str.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
    str = str.replace(/đ/gi, 'd');
    //Xóa các ký tự đặt biệt;
    return str;
};

function slugGenerator(str) {
    str = viVN_to_enUS(str);
    str = str
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .replace(/ /gi, '-');
    //Đổi khoảng trắng thành ký tự gạch ngang
    return str;
};
