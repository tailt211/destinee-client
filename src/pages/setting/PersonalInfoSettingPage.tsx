import { IonHeader, IonPage } from '@ionic/react';
import { FC } from 'react';
import PageContentCmp from '../../components/container/PageContentCmp';
import InfoSettingCmp from '../../components/info-setting/InfoSettingCmp';
import TitleToolbarCmp from '../../components/toolbar/TitleToolbarCmp';
import usePersonalSetting from '../../hooks/use-personal-setting';
import styles from './PersonalInfoSettingPage.module.scss';

const PersonalInfoSettingPage: FC = function (props) {
    const fieldList = usePersonalSetting();

    return (
        <IonPage className="grey__bg">
            <IonHeader>
                <TitleToolbarCmp title="Cập nhật hồ sơ cá nhân" />
            </IonHeader>
            <PageContentCmp customStyle={{ color: 'white', paddingTop: '17px' }}>
                <div className={styles.container}>
                    <InfoSettingCmp fieldList={fieldList} />
                </div>
            </PageContentCmp>
        </IonPage>
    );
};

export default PersonalInfoSettingPage;
