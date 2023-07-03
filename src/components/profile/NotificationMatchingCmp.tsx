import {IonSlide, IonSlides } from '@ionic/react';
import React from 'react';
import styles from './NotificationMatchingCmp.module.scss';

export interface NotificationMatching {
    userOne: string;
    userTwo: string;
    isMaleUserOne: boolean;
    isMaleUserTwo: boolean;
}

const NotificationMatchingCmp: React.FC<{
    notificateList: NotificationMatching[];
}> = ({ notificateList }) => {
    const slideOpts = {
        initialSlide: 0,
        slidesPerView: 1,
        speed: 400,
        autoplay: true,
        loop: true,
        noSwipingClass: 'swiper-no-swiping',
    };

    return (
        <IonSlides
            options={slideOpts}
            className={styles.slideContainer}
            class="swiper-no-swiping">
            {notificateList.map((noti, index) => {
                return (
                    <IonSlide key={index}>
                        <h4>
                            {noti.isMaleUserOne ? '♂️' : '♀️'} <u>{noti.userOne}</u>{' '}đã
                            ghép cặp thành công với <u>{noti.userTwo}</u>{' '}
                            {noti.isMaleUserTwo ? '♂️' : '♀️'}
                        </h4>
                    </IonSlide>
                );
            })}
        </IonSlides>
    );
};

export default NotificationMatchingCmp;
