import { IonButton, IonRippleEffect, IonSpinner } from '@ionic/react';
import moment from 'moment';
import { FC, useCallback, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useQueue from '../../hooks/use-queue';
import { RootState } from '../../store';
import { QueueState } from '../../store/queue/queue.slice';
import UIEffectContext from '../../store/UIEffectContext';
import { convertSecondToHHMMSS, convertToDateTime } from '../../utils/time.helper';
import styles from './CallTimeRangeModalCmp.module.scss';

export type TimeRangeModalDestination = 'setup' | 'start';

type CallTimeRangeModalCmpProps = {
    destination: TimeRangeModalDestination;
    closeModal: () => void;
};

const CallTimeRangeModalCmp: FC<CallTimeRangeModalCmpProps> = function ({ destination, closeModal }) {
    const { startQueue, setupQueue } = useQueue();
    const { clickFx } = useContext(UIEffectContext);
    /* State */
    const [now, setNow] = useState(new Date().toISOString());
    const [diff, setDiff] = useState(0);
    const { loading: queueLoading } = useSelector((state: RootState) => state.queue) as QueueState;
    /* Handler */
    const skipHandler = async () => {
        clickFx();
        if (destination === 'setup') setupQueue();
        else if (destination === 'start') startQueue();
        closeModal();
    };
    const calcTimerLeft = useCallback(() => {
        const timeUp = moment(process.env.REACT_APP_CALL_LIMIT_FROM, 'hh:mm');
        let secDiff = timeUp.diff(moment(), 'seconds');
        if (secDiff < 0) {
            timeUp.add(1, 'day');
            secDiff = timeUp.diff(moment(), 'seconds');
        }
        setDiff(secDiff);
    }, []);
    /* Effect */
    useEffect(() => {
        calcTimerLeft();
        const _ = setInterval(() => setNow(new Date().toISOString()), 1000);
        const _2 = setInterval(() => {
            calcTimerLeft();
        }, 1000);
        return () => {
            clearInterval(_);
            clearInterval(_2);
        };
    }, [calcTimerLeft]);

    return (
        <div className={styles.container}>
            <div className={styles.timeRangeContainer}>
                <span>Hãy quay lại vào khung giờ</span>
                <span className={styles.bold}>
                    {process.env.REACT_APP_CALL_LIMIT_FROM} đến {process.env.REACT_APP_CALL_LIMIT_TO}
                </span>
                <span>Để chắc chắn tỉ lệ gặp gỡ là cao nhất</span>
            </div>
            <div className={styles.line} />
            <div className={styles.nowContainer}>
                <span className={styles.now}>Bây giờ là</span>
                <span className={styles.bold}>{convertToDateTime(now, 'full-time')}</span>
                <span className={styles.timeLeft}>Còn {convertSecondToHHMMSS(diff)} nữa</span>
            </div>
            <div className={styles.buttonContainer}>
                <IonButton onClick={skipHandler} className={`${styles.autoMatch}`} disabled={queueLoading}>
                    {queueLoading && <IonSpinner color="white" name="crescent" className="m-auto" />}
                    {!queueLoading && 'Tôi muốn gọi ngay lúc này'}
                    <IonRippleEffect />
                </IonButton>
            </div>
        </div>
    );
};

export default CallTimeRangeModalCmp;
