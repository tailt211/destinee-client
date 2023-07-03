/* eslint-disable jsx-a11y/anchor-is-valid */
import { IonItem, IonToolbar } from '@ionic/react';
import { FC, Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import brandLogo from '../../assets/destinee-brand-logo.png';
import { getAvatar } from '../../model/image/image.helper';
import { TYPE_IMAGE } from '../../model/image/type-image.enum';
import { packageDisplayer } from '../../model/package-displayer';
import PersonalityTestHistoryPage from '../../pages/personality-test/PersonalityTestHistoryPage';
import MyProfilePage from '../../pages/profile/MyProfilePage';
import CallInfoSettingPage from '../../pages/setting/CallInfoSettingPage';
import PersonalInfoSettingPage from '../../pages/setting/PersonalInfoSettingPage';
import { RoutePage } from '../../router/pages';
import { PATHS } from '../../router/paths';
import { AppDispatch, RootState } from '../../store';
import { AuthState } from '../../store/auth/auth.slice';
import { logoutThunk } from '../../store/auth/auth.thunk';
import { ProfileState } from '../../store/profile/profile.slice';
import { convertToDateTime } from '../../utils/time.helper';
import styles from './MainToolbarCmp.module.scss';

export const menuPages: RoutePage[] = [
    {
        name: 'Trang cá nhân',
        path: PATHS.MY_PROFILE,
        component: MyProfilePage,
        exact: false,
    },
    {
        name: 'Cập nhật hồ sơ cá nhân',
        path: PATHS.PERSONAL_INFO_SETTING,
        component: PersonalInfoSettingPage,
        exact: true,
    },
    {
        name: 'Cập nhật hồ sơ hiển thị trong cuộc gọi',
        path: PATHS.CALL_INFO_SETTING,
        component: CallInfoSettingPage,
        exact: true,
    },
    {
        name: 'Tính cách của bạn',
        path: PATHS.PERSONALITY_TEST_HISTORY,
        component: PersonalityTestHistoryPage,
        exact: true,
    },
];

const MainToolbarCmp: FC = function () {
    const dispatch: AppDispatch = useDispatch();
    /* State */
    const [isOpenMenu, setOpenMenu] = useState(false);
    const { token } = useSelector((state: RootState) => state.auth) as AuthState;
    const { username, avatar, personalInfo } = useSelector((state: RootState) => state.profile) as ProfileState;
    const { upgrade } = useSelector((state: RootState) => state.account);
    /* Handler */
    const menuToggleHandler = function () {
        setOpenMenu((prev) => !prev);
    };

    return (
        <Fragment>
            <IonToolbar className={`${styles.customToolbar}`}>
                <img src={brandLogo} alt="destineelogo" />
                <IonItem slot="end" lines="none" button={true} type="button" detail={false} onClick={menuToggleHandler}>
                    <div className={`${styles.menuDropdown}`}>
                        <span>{username} {upgrade ? `(${packageDisplayer[upgrade.package].displayer})` : ''}</span>
                        <img src={getAvatar(avatar, TYPE_IMAGE.SQUARE, personalInfo.gender)} alt="avatar" />
                    </div>
                </IonItem>
            </IonToolbar>
            <div className={`${styles.menuDropdownContainer} ${!isOpenMenu && 'ion-hide'}`}>
                {menuPages.map((page) => <NavLink to={`/${page.path}`} key={page.name}>{page.name}</NavLink>)}
                {token && <a onClick={(e) => { e.preventDefault(); dispatch(logoutThunk()) }}>Đăng xuất</a>}
                {upgrade && (<div className={styles.upgradeContainer}>
                    <p>Gói nâng cấp: <span>{upgrade.package}</span></p>
                    <p>Ngày hết hạn: <span>{convertToDateTime(upgrade.expiresDate)}</span></p>
                </div>)}
            </div>
        </Fragment>
    );
};

export default MainToolbarCmp;
