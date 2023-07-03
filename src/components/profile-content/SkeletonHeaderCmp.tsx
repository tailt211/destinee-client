import { IonItem, IonLabel, IonList, IonListHeader, IonSkeletonText, IonThumbnail } from '@ionic/react';
import { FC } from 'react';
import styles from './SkeletonHeaderCmp.module.scss';

const SkeletonHeaderCmp: FC = function () {
    return (
        <IonList lines="none" className={styles.container}>
            <IonListHeader>
                <IonSkeletonText animated={true} style={{ width: '80px' }}/>
            </IonListHeader>
            <IonItem>
                <IonThumbnail slot="start">
                    <IonSkeletonText animated={true}/>
                </IonThumbnail>
                <IonLabel>
                    <h3>
                        <IonSkeletonText animated={true} style={{ width: '90%' }}/>
                    </h3>
                    <p>
                        <IonSkeletonText animated={true} style={{ width: '70%' }}/>
                    </p>
                    <p>
                        <IonSkeletonText animated={true} style={{ width: '50%' }}/>
                    </p>
                </IonLabel>
            </IonItem>
        </IonList>
    );
};

export default SkeletonHeaderCmp;
