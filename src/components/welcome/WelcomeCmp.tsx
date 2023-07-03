import { IonRippleEffect } from '@ionic/react';
import classNames from 'classnames';
import { FC } from 'react';
import hiGif from '../../assets/hi.gif';
import styles from './WelcomeCmp.module.scss';

type WelcomeCmpProps = {
    onRegister: () => void;
    onLogin: () => void;
};

const WelcomeCmp: FC<WelcomeCmpProps> = function ({ onLogin, onRegister }) {
    return (
        <div className={styles.container}>
            <div className={styles.heading}>
                <img src={hiGif} alt="welcome" />
                <div className={styles.contentContainer}>
                    <p>
                        Chào bạn yêu đã đến với <span>Destinee</span>
                    </p>
                </div>
            </div>
            <p className={styles.description}>Nơi mọi người kết nối bằng câu chuyện tinh tế và sự thấu hiểu tâm hồn</p>
            <div className={styles.actionContainer}>
                <button className={classNames([styles.btnRegister, 'ion-activatable', 'ripple-parent'])} onClick={onRegister}>
                    Tôi chưa có tài khoản, đăng ký ngay
                    <IonRippleEffect />
                </button>
                <button className={classNames([styles.btnLogin, 'ion-activatable', 'ripple-parent'])} onClick={onLogin}>
                    Đăng nhập nào
                    <IonRippleEffect />
                </button>
            </div>
        </div>
    );
};

export default WelcomeCmp;
