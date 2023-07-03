import { IonHeader, IonPage } from '@ionic/react';
import classNames from 'classnames';
import moment from 'moment';
import { FC } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import PageContentCmp from '../../components/container/PageContentCmp';
import InfoSettingCmp from '../../components/info-setting/InfoSettingCmp';
import PublicInfoCmp from '../../components/profile/PublicInfoCmp';
import TitleToolbarCmp from '../../components/toolbar/TitleToolbarCmp';
import useCallSetting from '../../hooks/use-call-setting';
import { getAvatar } from '../../model/image/image.helper';
import { TYPE_IMAGE } from '../../model/image/type-image.enum';
import { PATHS } from '../../router/paths';
import { RootState } from '../../store';
import { ProfileState } from '../../store/profile/profile.slice';
import styles from './CallInfoSettingPage.module.scss';

const CallInfoSettingPage: FC = function (props) {
    const { _id, callSetting, ...profile } = useSelector((state: RootState) => state.profile) as ProfileState;
    const { fieldList } = useCallSetting();

    return (
        <IonPage className="grey__bg">
            <IonHeader>
                <TitleToolbarCmp title="Chỉnh sửa hồ sơ cuộc gọi" />
            </IonHeader>
            <PageContentCmp customStyle={{ color: 'white', paddingTop: '17px' }} scrollY={false}>
                <div className={styles.container}>
                    <div className="max-w-sm w-full">
                        <PublicInfoCmp
                            callInfo={{
                                name: profile.name,
                                gender: profile.personalInfo.gender,
                                nickname: profile.nickname,
                                birthdate: moment(profile.personalInfo.birthdate).toDate(),
                                sex: profile.personalInfo.sex,
                                mbtiResult: profile.mbtiResult,
                                /* Optional */
                                height: profile.personalInfo.height,
                                job: profile.personalInfo.job,
                                workAt: profile.personalInfo.workAt,
                                major: profile.personalInfo.major,
                                origin: profile.personalInfo.origin,
                                languages: profile.personalInfo.languages,
                                hobbies: profile.personalInfo.hobbies,
                            }}
                            avatar={getAvatar(profile.avatar, TYPE_IMAGE.BLUR_RESIZED, profile.personalInfo.gender)}
                            displayName={callSetting.displayName}
                            displayAge={callSetting.age}
                            displayHeight={callSetting.height}
                            displayHobbies={callSetting.hobbies}
                            displayLanguages={callSetting.languages}
                            displayJobStatus={callSetting.jobStatus}
                            displayOrigin={callSetting.origin}
                            displaySex={callSetting.sex}
                            isSkillColorize={true}
                        />
                    </div>
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

export default CallInfoSettingPage;
