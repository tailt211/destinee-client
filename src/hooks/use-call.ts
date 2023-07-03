import { useIonAlert } from '@ionic/react';
import { RefObject, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { RootState } from '../store';
import { CallState } from '../store/call/call.slice';

export default function useCall(endCallRef: RefObject<HTMLIonButtonElement>, homeRef: RefObject<HTMLIonButtonElement>) {
    const history = useHistory();
    const [presentAlert] = useIonAlert();
    const { isReady, isCalling, isCallEnded, questionaire } = useSelector((state: RootState) => state.call) as CallState;

    /* Effects */
    useEffect(() => {
        if (!isReady) {
            presentAlert({
                backdropDismiss: false,
                header: 'Thông báo từ hệ thống',
                message:
                    'Chúng tôi rất xin lỗi đã làm gián đoạn cuộc trò chuyện của hai người. Hiện tại hệ thống đang bảo trì hoặc có sự cố đột suất. Hẹn gặp lại bạn vào ít phút sau nhé, Destinee cám ơn bạn rất nhiều',
                buttons: [
                    {
                        text: 'Tôi hiểu rồi',
                        role: 'cancel',
                        handler: () => {
                            homeRef.current?.click();
                        },
                    },
                ],
            });
        } // Chỗ này phải được sửa vì sẽ có bug
        if (isCallEnded) endCallRef.current?.click(); // solution chỗ lỗi react history.push/replace thay đổi url nhưng không navigate đúng
    }, [
        history,
        isCalling,
        isCallEnded,
        questionaire.isAccepted,
        questionaire.answers,
        endCallRef,
        homeRef,
        isReady,
        presentAlert,
    ]);
}
