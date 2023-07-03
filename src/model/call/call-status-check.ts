export const checkCallStatus = (isReady: boolean, isAudioReady: boolean, presentAlert: any) => {
    if (!isReady) {
        presentAlert({
            backdropDismiss: true,
            header: 'Thực hiện cuộc gọi',
            message: 'Hiện không thể tìm kiếm cuộc gọi do có thể bạn đang gọi hoặc đang tìm cuộc gọi rồi',
            buttons: [{ text: 'Tôi hiểu rồi', role: 'cancel', handler: () => {} }],
        });
        return false;
    }
    if (!isAudioReady) {
        presentAlert({
            backdropDismiss: true,
            header: 'Thực hiện cuộc gọi',
            message:
                'Bạn không thể gọi điện khi chưa cấp quyền truy cập microphone, hãy chỉnh sửa quyền truy cập ở phần cài đặt của trình duyệt',
            buttons: [{ text: 'Tôi hiểu rồi', role: 'cancel', handler: () => {} }],
        });
        return false;
    }
    return true;
};