import { IonBackButton, IonButtons, IonItem, IonToolbar } from '@ionic/react';
import { FC, Fragment } from 'react';
import { useSelector } from 'react-redux';
import { getAvatar } from '../../model/image/image.helper';
import { TYPE_IMAGE } from '../../model/image/type-image.enum';
import { packageDisplayer } from '../../model/package-displayer';
import { RootState } from '../../store';
import { ProfileState } from '../../store/profile/profile.slice';
import styles from './AvatarToolbarCmp.module.scss';

const AvatarToolbarCmp: FC<{ isBackBtn?: boolean }> = function ({ isBackBtn = true }) {
    const { username, avatar, personalInfo } = useSelector((state: RootState) => state.profile) as ProfileState;
    const { upgrade } = useSelector((state: RootState) => state.account);

    return (
        <Fragment>
            <IonToolbar className={`${styles.customToolbar}`}>
                {isBackBtn && (
                    <IonButtons slot="start">
                        <IonBackButton text="" defaultHref="/" />
                    </IonButtons>
                )}
                <IonItem slot="end" lines="none">
                    <div className={`${styles.menuDropdown}`}>
                        <span>{username} {upgrade ? `(${packageDisplayer[upgrade.package].displayer})` : ''}</span>
                        <img src={getAvatar(avatar, TYPE_IMAGE.SQUARE, personalInfo.gender)} alt="avatar" />
                    </div>
                </IonItem>
            </IonToolbar>
        </Fragment>
    );
};

export default AvatarToolbarCmp;
