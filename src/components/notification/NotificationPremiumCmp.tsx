import { IonButton, IonSpinner } from '@ionic/react';
import { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import award from '../../assets/award.png';
// import gift from '../../assets/gift.png';
import unlock from '../../assets/unlock.png';
import { AppDispatch, RootState } from '../../store';
import { OrderState } from '../../store/order/order.slice';
import { generatePremiumOrderThunk } from '../../store/order/order.thunk';
import { vndFormatter } from '../../utils/number.helper';
import styles from './NotificationPremiumCmp.module.scss';

const descriptions: { label: string }[] = [
    { label: 'Có cơ hội biết được người đã cùng trò chuyện.' },
    // { comment: 'Tiếp tục cuộc trò chuyện bằng cách gọi điện hoặc nhắn tin.' },
    { label: 'Tiếp tục cuộc trò chuyện bằng cách nhắn tin.' },
    { label: 'Không giới hạn cuộc gọi trong ngày.' },
    // { comment: 'Nghe được ghi âm cuộc trò chuyện.' },
    { label: 'Lưu trữ lịch sử cuộc gọi mãi mãi.' },
];

type PremiumModalCmpProps = {
    customStyle?: {};
};

const NotificationPremiumCmp: FC<PremiumModalCmpProps> = function ({ customStyle = {} }) {
    const dispatch: AppDispatch = useDispatch();
    /* State */
    const { loading } = useSelector((state: RootState) => state.order) as OrderState;
    /* Handler */
    const upgradeActiveHandler = async () => {
        const { payload, meta } = await dispatch(generatePremiumOrderThunk());
        if (meta.requestStatus === 'fulfilled' && payload) window.location.replace(payload); 
    };

    // const inviteActiveHandler = () => {
    //     console.log(`Invited friends to unlock`);
    // };

    return (
        <div
            className={styles.container}
            style={{ ...customStyle }}>
            <div className={styles.contentContainer}>
                <div className={styles.unlockContainer}>
                    <img src={unlock} alt="unlock" />
                    <span>Để mở khoá tính năng</span>
                    <div className={styles.btnContainer}>
                        <IonButton color="yellow" onClick={upgradeActiveHandler} size="small">
                            {loading && <IonSpinner color="white" name="crescent" />}
                            {!loading && (
                                <div className={styles.btnContent}>
                                    <img src={award} alt="award" />
                                    <span>Gói thành viên {vndFormatter.format(parseInt(process.env.REACT_APP_PREMIUM_PRICE!))}đ / tháng</span>
                                </div>
                            )}
                        </IonButton>
                        {/* <IonButton className={styles.inviteBtn} onClick={inviteActiveHandler} size="small">
                            <div className={styles.btnContent}>
                                <img src={gift} alt="gift" />
                                <span>Mời 3 người đăng ký</span>
                            </div>
                        </IonButton> */}
                    </div>
                </div>
                <div className={styles.line} />
                <div className={styles.descContainer}>
                    {descriptions.map((item) => (
                        <div className={styles.item} key={item.label}><p>{item.label}</p></div>
                    ))}
                </div>
            </div>
            <div className={styles.noteContainer}>
                <span>Lưu ý :</span>
                <div className={styles.content}>
                    <p>Thông tin cuộc gọi sẽ bị xoá khỏi lịch sử sau 24 giờ </p>
                    <p>(*áp dụng cho tài khoản dùng thử)</p>
                </div>
            </div>
        </div>
    );
};

export default NotificationPremiumCmp;
