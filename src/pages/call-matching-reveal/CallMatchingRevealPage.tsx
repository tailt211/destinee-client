import { IonButton, IonIcon } from '@ionic/react';
import { closeCircleOutline } from 'ionicons/icons';
import { useContext, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Transition } from 'react-transition-group';
import ModalCancelCallCmp from '../../components/modal-cancel-matching-reveal/ModalCancelCallCmp';
import SecretProfileCmp from '../../components/secret-profile/SecretProfileCmp';
import useCall from '../../hooks/use-call';
import { getAvatar } from '../../model/image/image.helper';
import { TYPE_IMAGE } from '../../model/image/type-image.enum';
import { GENDER } from '../../model/profile/profile.constant';
import { PATHS } from '../../router/paths';
import { TAB_URL } from '../../router/tabs';
import { RootState } from '../../store';
import { CallState } from '../../store/call/call.slice';
import UIEffectContext from '../../store/UIEffectContext';
import styles from './CallMatchingRevealPage.module.scss';

const animationTiming = {
    enter: 200,
    exit: 500,
};

const CallMatchingRevealPage: React.FC = () => {
    const history = useHistory();
    const { clickFx } = useContext(UIEffectContext);
    const endCallRef = useRef<HTMLIonButtonElement>(null);
    const homeRef = useRef<HTMLIonButtonElement>(null);
    useCall(endCallRef, homeRef);
    /* State */
    const { revealAvatars, isCalling } = useSelector((state: RootState) => state.call) as CallState;
    const [isOpenCancelModal, setIsOpenCancelModal] = useState(false);
    const [timer, setTimer] = useState<number>(5);
    /* Handler */
    const openEndCallModal = () => {
        clickFx();
        setIsOpenCancelModal(true);
    };

    const closeEndCallModal = () => {
        setIsOpenCancelModal(false);
    };
    
    /* Effect */
    useEffect(() => {
        if (isCalling) return;
        history.push(`${TAB_URL}/${PATHS.HOME}`);
    }, [history, isCalling]);

    useEffect(() => {
        const _ = setInterval(() => {
            setTimer((timer) => --timer);
        }, 1000);
        if (timer === 0) history.push(`/${PATHS.CALL}/${PATHS.ON_CALLING}`);
        return () => clearInterval(_);
    }, [timer, history]);

    return (
        <>
            <IonButton routerLink={`/${PATHS.CALL_RATING}`} ref={endCallRef} className={'hidden'} />
            <IonButton routerLink={`${TAB_URL}/${PATHS.HOME}`} ref={homeRef} className={'hidden'} />
            <div className={styles.container}>
                <div className={styles.contentHeadingContainer}>
                    <div className={styles.title}>Một trong số những gương mặt dưới đây sẽ là người mà bạn nói chuyện</div>
                    {revealAvatars && (
                        <div className={styles.cardContainer}>
                            <div className={styles.top}>
                                <SecretProfileCmp
                                    image={getAvatar(revealAvatars[0], TYPE_IMAGE.BLUR_RESIZED, GENDER.FEMALE)}
                                    className={styles.pictureAnimation}
                                />
                                <SecretProfileCmp
                                    image={getAvatar(revealAvatars[1], TYPE_IMAGE.BLUR_RESIZED, GENDER.MALE)}
                                    className={styles.pictureAnimation}
                                />
                            </div>

                            <p className={styles.timer}>
                                Bắt đầu cuộc gọi trong <span>{timer}s</span>
                            </p>

                            <div className={styles.bottom}>
                                <SecretProfileCmp
                                    image={getAvatar(revealAvatars[2], TYPE_IMAGE.BLUR_RESIZED, GENDER.FEMALE)}
                                    className={styles.pictureAnimation}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className={styles.cancelContainer}>
                    <IonIcon icon={closeCircleOutline} className={styles.icon} onClick={openEndCallModal} />
                </div>
            </div>

            <Transition in={isOpenCancelModal} timeout={animationTiming} mountOnEnter unmountOnExit>
                {(state) => (
                    <ModalCancelCallCmp
                        onCloseCancelCallModal={closeEndCallModal}
                        customStyle={{
                            transition: 'opacity 0.3s ease-out',
                            opacity: state === 'entering' || state === 'exiting' ? 0 : 1,
                        }}
                    />
                )}
            </Transition>
        </>
    );
};

export default CallMatchingRevealPage;
