export const getToast =
    (header: string, dismiss: () => Promise<void>, duration: number = 2000) =>
    (message: string, status: 'success' | 'fail', _duration?: number, callback?: () => void) => ({
        buttons: [{ text: 'Ẩn', handler: () => dismiss() }],
        message,
        color: status === 'success' ? 'green' : 'danger',
        header,
        cssClass: 'text-white',
        duration: _duration || duration,
        onDidDismiss: () => {
            if(callback) callback();
        }
    });
