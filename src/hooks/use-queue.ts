import { useIonAlert } from '@ionic/react';
import { useContext } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { checkCallStatus } from '../model/call/call-status-check';
import { PATHS } from '../router/paths';
import { RootState } from '../store';
import { CallState } from '../store/call/call.slice';
import { HomeState } from '../store/home/home.slice';
import { ProfileState } from '../store/profile/profile.slice';
import { QueueState } from '../store/queue/queue.slice';
import SocketContext from '../store/SocketContext';
import UIEffectContext from '../store/UIEffectContext';

export default function useQueue() {
    const history = useHistory();
    const [presentAlert] = useIonAlert();
    const { startFindingCall } = useContext(SocketContext);
    const { swooshSoftSfx } = useContext(UIEffectContext);
    /* State */
    const profile = useSelector((state: RootState) => state.profile) as ProfileState;
    const { isReady } = useSelector((state: RootState) => state.call) as CallState;
    const { filter: queueFilter } = useSelector((state: RootState) => state.queue) as QueueState;
    const { isAudioReady } = useSelector((state: RootState) => state.home) as HomeState;

    /* Handler */
    const startQueue = async () => {
        if (!checkCallStatus(isReady, isAudioReady, presentAlert)) return;
        await startFindingCall(queueFilter);
        history.push(`/${PATHS.CALL_FINDING}`);
        swooshSoftSfx();
    };

    const setupQueue = async () => {
        if (!checkCallStatus(isReady, isAudioReady, presentAlert)) return;
        if (profile._id === '') {
            presentAlert({
                backdropDismiss: true,
                header: 'Ứng dụng đang tải thông tin của bạn',
                message: 'Chờ trong giây lát và thử lại khi thông tin đã tải hoàn tất',
                buttons: [{ text: 'Tôi hiểu rồi', role: 'cancel', handler: () => {} }],
            });
            return;
        }
        history.push(`/${PATHS.QUEUE_SETUP}`);
        swooshSoftSfx();
    }

    return { startQueue, setupQueue };
}
