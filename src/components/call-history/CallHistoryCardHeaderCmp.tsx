import { IonIcon } from '@ionic/react';
import { informationCircleOutline } from 'ionicons/icons';
import React from 'react';
import { REVIEW } from '../../model/call/review.enum';
import { ImageDTO } from '../../model/image/dto/image.dto';
import { getAvatar } from '../../model/image/image.helper';
import { TYPE_IMAGE } from '../../model/image/type-image.enum';
import { GENDER } from '../../model/profile/profile.constant';
import { convertSecondToHHMMSS, getTimeSince } from '../../utils/time.helper';
import styles from './CallHistoryCardHeaderCmp.module.scss';

export interface CallHistory {
    id: string;
    username: string;
    lastCall: string;
    duration: number;
    userDetail: {
        mbtiType: string;
        compatibility: number;
        otherReviews: REVIEW[];
        yourReviews: REVIEW[];
        rating: number;
        gender: GENDER;
    };
}

type CallHistoryCardHeaderCmpProps = {
    name: string;
    createdAt: string;
    duration: number;
    avatar?: ImageDTO | string;
    gender: GENDER;
};

const CallHistoryCardHeaderCmp: React.FC<CallHistoryCardHeaderCmpProps> = (props) => {
    const { name, createdAt, duration, avatar, gender } = props;

    return (
        <div slot="header" className={styles.heading}>
            <div className={styles.infoContainer}>
                <div className={styles.userInfo}>
                    <img src={getAvatar(avatar, TYPE_IMAGE.SQUARE, gender)} alt="avatar" />
                    <span>{name}</span>
                </div>
                <div className={styles.callInfo}>
                    <div className={styles.container}>
                        <span>Cách đây {getTimeSince(new Date(createdAt))} trước</span>
                        <span>Thời lượng : {convertSecondToHHMMSS(duration)}</span>
                    </div>
                </div>
            </div>
            <IonIcon icon={informationCircleOutline}></IonIcon>
        </div>
    );
};

export default CallHistoryCardHeaderCmp;
