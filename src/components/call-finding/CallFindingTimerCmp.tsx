import React, { useEffect, useState } from 'react';
import { secondToTimerFormat } from '../../utils/formatter';
import styles from './CallFindingTimerCmp.module.scss';

const CallFindingTimerCmp: React.FC = () => {
    const [timer, setTimer] = useState<number>(0);
    useEffect(() => {
        const _ = setInterval(() => setTimer((sec) => sec + 1), 1000);
        return () => clearInterval(_);
    }, []);

    return (
        <div className={styles.timeFinding}>
            <div className={`${styles.textDescription} ${styles.cardTextTime}`}>
                <div className={styles.onlineCheckLine}></div>
                Sẵn sàng | Đang tìm cuộc gọi {secondToTimerFormat(timer)}
            </div>
        </div>
    );
};

export default CallFindingTimerCmp;
