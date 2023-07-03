import { IonIcon, IonSpinner } from '@ionic/react';
import { truncate } from 'lodash';
import clockImg from '../../assets/clock.png';
import destineeLogo from '../../assets/destinee-logo.png';
import { notificationDisplayer } from '../../model/notification/notification-displayer';
import { NOTIFICATION_TYPE } from '../../model/notification/notification-type';
import { getTimeSince } from '../../utils/time.helper';
import styles from './NotificationCmp.module.scss';

const NotificationCmp: React.FC<{
    loading?: boolean;
    name: string | null;
    avatar?: string | null;
    type: NOTIFICATION_TYPE;
    content?: string;
    createdAt: string;
    clickHandler: () => void;
}> = ({ loading = false, avatar, name, type, content, createdAt, clickHandler }) => {
    avatar = avatar || notificationDisplayer[type].avatar;
    let icon = notificationDisplayer[type].icon;
    let message = notificationDisplayer[type].message;
    return (
        <div className={styles.notificationWrapper} onClick={clickHandler.bind(null, type)}>
            {!loading && (
                <>
                    {avatar && <img src={avatar || destineeLogo} alt="avatar" />}
                    {icon && <IonIcon icon={icon} />}
                    <div className={styles.messageContainer}>
                        <span>
                            {name && <b>{name}</b>}
                            {` ${message}`}
                            {type === NOTIFICATION_TYPE.DIRECT_MESSAGE && `: ${truncate(content, { length: 50 })}`}
                        </span>
                        <div className={styles.timeMessage}>
                            <img src={clockImg} alt="clock" />
                            <span>{getTimeSince(new Date(createdAt))} trước</span>
                        </div>
                    </div>
                </>
            )}
            {loading && <IonSpinner color="white" name="crescent" className="mx-auto" />}
        </div>
    );
};

export default NotificationCmp;
