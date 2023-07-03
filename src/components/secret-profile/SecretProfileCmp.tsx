import classNames from 'classnames';
import { FC, useContext, useState } from 'react';
import UIEffectContext from '../../store/UIEffectContext';
import styles from './SecretProfileCmp.module.scss';

const SecretProfileCmp: FC<{
    image: string,
    className?: any,
}> = function ({ className, image }) {
    const { vibrate } = useContext(UIEffectContext);
    const [isShowPicture, setIsShowPicture] = useState(false);

    const onOpenPicture = () => {
        vibrate('xs');
        setIsShowPicture(!isShowPicture);
    }

    const containerClass = classNames([
        styles.secretProfileCmp,
        { [className]: className },
    ]);

    const cardClass = classNames([
        styles.card,
        { [styles.showAndHideCard]: isShowPicture }
    ]);
    return (
        <div className={containerClass} onClick={onOpenPicture}>
            <div className={cardClass}>
                <img src={image} className={styles.image} alt='secret avatar'/>
                <div className={styles.hideImage}>
                    <h1>Bí mật</h1>
                    <p>Nhấn vào để hiển thị</p>
                </div>
            </div>
        </div>
    );
};

export default SecretProfileCmp;
