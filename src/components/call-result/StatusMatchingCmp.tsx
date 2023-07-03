import React from 'react';
import styles from './StatusMatchingCmp.module.scss';

type StatusMatchingCmpProps = {
    receiverName: string;
    callerAvatar: string;
    receiverAvatar: string;
    matchingPercentage: number;
    quote: string;
    color: string;
};

const StatusMatchingCmp: React.FC<StatusMatchingCmpProps> = ({
    receiverName,
    callerAvatar,
    receiverAvatar,
    matchingPercentage,
    quote,
    color = 'green'
}) => {
    return (
        <div className={styles.statusContainer}>
            <span>Bạn &amp; {receiverName}</span>

            <div className={styles.imgContainer}>
                <img className={styles.imgAvtLeft} src={callerAvatar} alt="avatar" />
                <img className={styles.imgAvtRight} src={receiverAvatar} alt="avatar" />
            </div>

            <div className={styles.resultCircle} style={{backgroundColor: `var(--ion-color-${color})`}}>
                <h3>{matchingPercentage}%</h3>
            </div>

            <p style={{ color: `var(--ion-color-${color})` }}>{quote}</p>

            <div className={styles.line} />
        </div>
    );
};

export default StatusMatchingCmp;
