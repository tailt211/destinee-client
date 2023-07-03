import { FC } from 'react';
import styles from './NotificationFriendRequestCmp.module.scss';
import { getPercentage } from './../on-calling/on-calling.helper';
import { ImageDTO } from '../../model/image/dto/image.dto';
import { getAvatar } from '../../model/image/image.helper';
import { TYPE_IMAGE } from '../../model/image/type-image.enum';
import { GENDER } from '../../model/profile/profile.constant';
import { MBTI_TYPE } from '../../model/personality-test/mbti-type.enum';
const MESSAGE = 'gửi cho bạn một lời mời kết bạn';

type NotificationFriendRequestCmpProps = {
    name: string;
    avatar?: ImageDTO | string;
    mbtiType: MBTI_TYPE | null;
    compatibility?: number;
    onConfirm: () => void;
    onDelete: () => void;
    maxWidth?: string;
    gender: GENDER;
};

const NotificationFriendRequestCmp: FC<NotificationFriendRequestCmpProps> = function ({
    name,
    avatar,
    mbtiType,
    compatibility,
    onConfirm,
    onDelete,
    maxWidth = '352px',
    gender,
}) {
    return (
        <div className={styles.container} style={{ maxWidth }}>
            <img src={getAvatar(avatar, TYPE_IMAGE.BLUR_SQUARE, gender)} alt="avatar" />
            <div className={styles.contentContainer}>
                <span className={styles.message}>
                    <b>{name}</b> {MESSAGE}
                </span>
                {mbtiType && (
                    <div className={styles.rowContent}>
                        <p>Kiểu tính cách: </p>
                        <div className={styles.badge} style={{ background: 'var(--ion-color-green)' }}>
                            {mbtiType}
                        </div>
                    </div>
                )}
                {compatibility && (
                    <div className={styles.rowContent}>
                        <p>Hợp nhau về quan điểm: </p>
                        <div
                            className={styles.badge}
                            style={{
                                background: 'var(--ion-color-teal)',
                                minWidth: 'fit-content',
                            }}>
                            {getPercentage(compatibility)}%
                        </div>
                    </div>
                )}
                <div className={styles.actionContainer}>
                    <button className={styles.verifyBtn} onClick={onConfirm.bind(null)}>
                        Xác nhận
                    </button>
                    <button className={styles.deleteBtn} onClick={onDelete.bind(null)}>
                        Xoá
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationFriendRequestCmp;
