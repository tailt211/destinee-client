import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonModal,
    IonTitle,
    IonToolbar,
} from '@ionic/react';
import { FC, useRef } from 'react';
import styles from './FavoriteModalCmp.module.scss';


const FavoriteModalCmp: FC<{
    presentingElement: HTMLElement | null;
    numberOfSelected: number;
    modalTriggerId: string;
}> = function ({ children, presentingElement, numberOfSelected, modalTriggerId }) {
    const modal = useRef<HTMLIonModalElement>(null);

    return (
        <IonModal className={styles.modal} ref={modal} trigger={modalTriggerId} presentingElement={presentingElement!}>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Đã chọn {numberOfSelected} bài hát</IonTitle>
                    <IonButtons slot="end">
                        <IonButton color="black" onClick={() => modal.current?.dismiss()}>
                            Đóng
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">{children}</IonContent>
        </IonModal>
    );
};

export default FavoriteModalCmp;
