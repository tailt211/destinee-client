import { FC } from 'react';
import styles from './NotificationReportCmp.module.scss';

type NotificationReportCmpProps = {
    message: string;
    reason: string;
    punishmentType: string;
    onConfirm: () => void;
    onDelete: () => void;
};

const NotificationReportCmp: FC<NotificationReportCmpProps> = function ({
    message,
    punishmentType,
    reason,
    onConfirm,
    onDelete,
}) {
    return (
        <div className={styles.container}>
            <div className={styles.contentContainer}>
                <p className={styles.message}>{message}</p>
                <div className={styles.rowContent}>
                    <p>Hình phạt: </p>
                    <div
                        className={styles.badge}
                        style={{
                            background: 'rgba(204, 47, 67, 0.64)',
                            minWidth: 'fit-content',
                        }}>
                        {punishmentType}
                    </div>
                </div>
                <span>Lý do:</span>
                <div className={styles.reasonContainer}><span>{reason}</span></div>
            </div>
            <div className={styles.actionContainer}>
                <button className={styles.verifyBtn} onClick={onConfirm.bind(null)}>
                    Đồng ý quyết định xử phạt
                </button>
                <button className={styles.deleteBtn} onClick={onDelete.bind(null)}>
                    Kháng cáo
                </button>
            </div>
        </div>
    );
};

export default NotificationReportCmp;
