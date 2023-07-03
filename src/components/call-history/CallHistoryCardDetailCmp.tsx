import { IonIcon } from '@ionic/react';
import classNames from 'classnames';
import { starSharp } from 'ionicons/icons';
import React from 'react';
import { reviewDisplayer } from '../../model/call/review-displayer';
import { REVIEW } from '../../model/call/review.enum';
import { MBTI_TYPE } from '../../model/personality-test/mbti-type.enum';
import { getPercentage } from '../on-calling/on-calling.helper';
import styles from './CallHistoryCardDetailCmp.module.scss';

const CallHistoryCardDetailCmp: React.FC<{
    otherMbtiType: MBTI_TYPE | null;
    compatibility?: number;
    otherReviews: REVIEW[];
    yourReviews: REVIEW[];
    yourRate?: number;
    otherRate?: number;
}> = (props) => {
    return (
        <div className={styles.container}>
            {props.otherMbtiType && (
                <div className={styles.item}>
                    <span>Kiểu tính cách của người ấy:</span>
                    <div className={classNames([styles.badge, styles.mbtiType])}>{props.otherMbtiType}</div>
                </div>
            )}
            {!!props.compatibility && (
                <div className={styles.item}>
                    <span>Hợp nhau về quan điểm:</span>
                    <div className={classNames([styles.badge, styles.compatibility])}>{getPercentage(props.compatibility)}%</div>
                </div>
            )}
            {props.yourReviews?.length > 0 && (
                <div className={styles.item}>
                    <span>Cảm nhận của bạn:</span>
                    <div className={styles.badgeContainer}>
                        {props.yourReviews.map((review) => {
                            return (
                                reviewDisplayer[review] && (
                                    <div key={review} className={classNames([styles.badge, styles.yourReviews])}>
                                        {reviewDisplayer[review]?.displayer}
                                    </div>
                                )
                            );
                        })}
                    </div>
                </div>
            )}
            {props.otherReviews?.length > 0 && (
                <div className={styles.item}>
                    <span>Cảm nhận của người ấy:</span>
                    <div className={styles.badgeContainer}>
                        {props.otherReviews.map((review) => {
                            return (
                                reviewDisplayer[review] && (
                                    <div key={review} className={classNames([styles.badge, styles.otherReviews])}>
                                        {reviewDisplayer[review]?.displayer}
                                    </div>
                                )
                            );
                        })}
                    </div>
                </div>
            )}
            {props.yourRate && (
                <div className={styles.item}>
                    <span>Đánh giá của bạn :</span>
                    <div className={styles.iconContainer}>
                        {Array.from(Array(props.yourRate), (e, i) => {
                            return <IonIcon icon={starSharp} key={i} className={styles.starRating} />;
                        })}
                    </div>
                </div>
            )}
            {props.otherRate && (
                <div className={styles.item}>
                    <span>Đánh giá của người ấy :</span>
                    <div className={styles.iconContainer}>
                        {Array.from(Array(props.otherRate), (e, i) => {
                            return <IonIcon icon={starSharp} key={i} className={styles.starRating} />;
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CallHistoryCardDetailCmp;
