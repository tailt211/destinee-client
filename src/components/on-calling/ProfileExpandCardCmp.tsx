import { IonAccordion, IonAccordionGroup, IonIcon } from '@ionic/react';
import { chevronDown, chevronUp } from 'ionicons/icons';
import React, { useContext, useRef, useState } from 'react';
import { PersonalCallInfo } from '../../model/call-information';
import UIEffectContext from '../../store/UIEffectContext';
import FavoritesCmp, { FavoriteType } from '../profile/FavoritesCmp';
import ProfileCardCmp from '../profile/profile-card/ProfileCardCmp';
import styles from './ProfileExpandCardCmp.module.scss';

type ProfileExpandCardCmpProps = {
    callInfo: PersonalCallInfo;
    avatar: string;
    isReverseLayout?: boolean;
    favorites: FavoriteType[];
    isScrollUp?: boolean;
};

const ProfileExpandCardCmp: React.FC<ProfileExpandCardCmpProps> = ({
    callInfo,
    avatar,
    isReverseLayout,
    favorites,
    isScrollUp,
}) => {
    const { vibrate } = useContext(UIEffectContext);
    const accordionGroup = useRef<null | HTMLIonAccordionGroupElement>(null);
    /* State */
    const [expandCard, setExpandCard] = useState<boolean>(true);
    const expandBackGround = expandCard ? 'transBackground' : isScrollUp ? 'whiteBackground' : 'scrollDown';
    const expandIcon = expandCard ? chevronDown : chevronUp;
    const expandIconClass = expandCard ? 'iconWhite' : 'iconBlack';
    /* Handler */
    const expandHandler = () => {
        vibrate('xs');
        setExpandCard((prevState) => !prevState);
    };
    const toggleAccordionHandler = () => {
        if (!accordionGroup.current) return;
        const nativeEl = accordionGroup.current;
        if (nativeEl.value === 'first') {
            nativeEl.value = undefined;
            expandHandler();
        } else nativeEl.value = 'first';
    };

    return (
        <div className={styles.cardContainer}>
            <IonAccordionGroup ref={accordionGroup}>
                <IonAccordion value="first" className={styles[expandBackGround]}>
                    <div slot="header" onClick={expandHandler} className={styles.headerContent}>
                    {isReverseLayout && <IonIcon icon={expandIcon} className={`${styles.iconLeft} ${styles[expandIconClass]}`} />}
                        <ProfileCardCmp
                            callInfo={callInfo}
                            avatar={avatar}
                            setBlurBackground={false}
                            fixHeight={expandCard ? '186px' : ''}
                            color={expandCard ? 'white' : 'black'}
                            isExpand={expandCard}
                            isReverseLayout={isReverseLayout}
                            isCollapse={!expandCard}
                        />
                        {!isReverseLayout && <IonIcon icon={expandIcon}  className={`${styles.iconRight} ${styles[expandIconClass]}`} />}
                    </div>

                    <div slot="content" className={styles.favoritesContent} onClick={toggleAccordionHandler}>
                        {favorites.map((favorite) => (
                            <FavoritesCmp
                                title={favorite.title}
                                type={favorite.type}
                                items={favorite.items}
                                key={favorite.title}
                                isReverse={isReverseLayout}
                            />
                        ))}
                    </div>
                </IonAccordion>
            </IonAccordionGroup>
        </div>
    );
};

export default ProfileExpandCardCmp;
