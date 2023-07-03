import classNames from 'classnames';
import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router';
import { PATHS } from '../../router/paths';
import UIEffectContext from '../../store/UIEffectContext';
import styles from './CardResultSuggestCmp.module.scss';

const CardResultSuggestCmp: React.FC<{
    textSuggest?: string;
    isChange?: boolean;
    myAvatar?: string;
    otherAvatar?: string;
    percentMatching?: number;
}> = ({ textSuggest, isChange, myAvatar, otherAvatar, percentMatching }) => {
    const { vibrate } = useContext(UIEffectContext);
    const history = useHistory();
    /* State */
    const [isExpand, setIsExpand] = useState<boolean>(false);
    const expandClassName = isExpand ? 'cardExpandAnimate' : '';
    /* Handler */
    const onExpandAnimateHandler = () => {
        vibrate('xs');
        setIsExpand((prev) => (prev = !prev));
        setTimeout(() => {
            history.replace(`/${PATHS.CALL}/${PATHS.CALL_RESULT}`);
        }, 500);
    };
    return (
        <div className={`${styles.cardWrapper} ${styles[expandClassName]}`}>
            <div className={`${styles.resultSuggestCard} ${styles[expandClassName]}`} onClick={onExpandAnimateHandler}>
                {!isChange && <p className={classNames([{ [styles.hide]: isExpand }])}>{textSuggest}</p>}
                {isChange && (
                    <div className={classNames([styles.resultMatchingCard, { [styles.hide]: isExpand }])}>
                        <div className={styles.imgContainer}>
                            <img className={styles.above} src={myAvatar} alt="avatar" />
                            <img src={otherAvatar} alt="avatar" />
                        </div>
                        <span className={styles.textArea}>
                            <div>
                                Bạn và đối phương hợp nhau đến <span className={styles.percentMatch}>{percentMatching}%</span>
                            </div>
                            <div className={styles.backToResult}>Nhấp để xem lại toàn bộ câu trả lời</div>
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CardResultSuggestCmp;
