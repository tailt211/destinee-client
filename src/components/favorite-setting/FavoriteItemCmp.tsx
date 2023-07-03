import { IonAvatar, IonCheckbox, IonImg, IonItem, IonLabel } from '@ionic/react';
import classNames from 'classnames';
import { FC } from 'react';
import styles from './FavoriteItemCmp.module.scss';
import tmpPic from '../../assets/gai-7.jpg'

const FavoriteItemCmp: FC<{
    thumbnail: string;
    thumbnailAlt: string;
    title: string;
    description: string;
    isChecked: boolean;
    checkHandler: () => void;
    isModalItem?: boolean;
}> = function ({ thumbnail, thumbnailAlt, title, description, checkHandler, isChecked, isModalItem = false }) {
    return (
        <IonItem
            className={classNames([styles.item, { [styles.modalItem]: isModalItem }])}>
            <IonAvatar slot="start">
                <IonImg src={thumbnail !== 'N/A' ? thumbnail : tmpPic} alt={thumbnailAlt} />
            </IonAvatar>
            <IonLabel>
                <h2>{title}</h2>
                <p>{description}</p>
            </IonLabel>
            <IonCheckbox slot="end" checked={isChecked} onIonChange={checkHandler} />
        </IonItem>
    );
};

export default FavoriteItemCmp;
