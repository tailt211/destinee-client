import { IonButton, IonIcon } from '@ionic/react';
import classNames from 'classnames';
import { checkmarkCircle, fileTrayFull } from 'ionicons/icons';
import { FC } from 'react';
import styles from './FavoriteActionButtonsCmp.module.scss';

const FavoriteActionButtonsCmp: FC<{
    numberOfSelected: number;
    objectTitle: string;
    openModalId: string;
    saveHandler: () => void;
}> = function ({ numberOfSelected, objectTitle, openModalId, saveHandler }) {
    return (
        <div
            className={classNames([
                'grid grid-flow-row sm:grid-flow-col',
                styles.actionButtons,
            ])}>
            <IonButton id={openModalId}>
                <IonIcon icon={fileTrayFull} /> Đã chọn {numberOfSelected} {objectTitle}
            </IonButton>
            <IonButton
                color="green"
                onClick={saveHandler}
                // eslint-disable-next-line no-useless-computed-key
                style={{ ['--ion-color-contrast']: 'none' }}>
                <IonIcon icon={checkmarkCircle} />
                Lưu
            </IonButton>
        </div>
    );
};

export default FavoriteActionButtonsCmp;
