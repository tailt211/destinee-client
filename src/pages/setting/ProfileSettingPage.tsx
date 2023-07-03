import { IonHeader, IonPage } from '@ionic/react';
import classNames from 'classnames';
import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import PageContentCmp from '../../components/container/PageContentCmp';
import InfoSettingCmp from '../../components/info-setting/InfoSettingCmp';
import TitleToolbarCmp from '../../components/toolbar/TitleToolbarCmp';
import useProfilePageSetting from '../../hooks/use-profile-page-setting';
import { PATHS } from '../../router/paths';
import styles from './ProfileSettingPage.module.scss';

const ProfileSettingPage: FC = function (props) {
    const { fieldList } = useProfilePageSetting();

    return (
        <IonPage className="grey__bg">
            <IonHeader>
                <TitleToolbarCmp title="Chỉnh sửa trang cá nhân" />
            </IonHeader>
            <PageContentCmp customStyle={{ color: 'white', paddingTop: '17px' }} scrollY={false}>
                <div className={styles.container}>
                    <div className={classNames('overflow-y-scroll w-full h-full', styles.infoSettingContainer)}>
                        <InfoSettingCmp fieldList={fieldList} />
                    </div>
                    <NavLink className={'text-center text-md underline font-light'} to={`/${PATHS.PERSONAL_INFO_SETTING}`}>
                        Cập nhật hồ sơ cá nhân
                    </NavLink>
                </div>
            </PageContentCmp>
        </IonPage>
    );
};

export default ProfileSettingPage;
