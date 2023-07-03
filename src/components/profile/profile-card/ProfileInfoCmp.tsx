import { IonIcon } from '@ionic/react';
import classNames from 'classnames';
import { femaleOutline, maleOutline } from 'ionicons/icons';
import { isEmpty } from 'lodash';
import { FC } from 'react';
import { PersonalCallInfo } from '../../../model/call-information';
import { GENDER, SEX } from '../../../model/profile/profile.constant';
import { getAge } from '../../../utils/formatter';
import {
    jobDisplayer,
    languageDisplayer,
    regionDisplayer,
    sexDisplayer,
} from '../../info-setting/field-section/field-section-displayer';
import { CallInfoVisibility } from '../profile.type';
import HobbiesCmp from './HobbiesCmp';
import styles from './ProfileInfoCmp.module.scss';

type ProfileInfoProps = CallInfoVisibility & {
    callInfo: PersonalCallInfo;
    color?: string;
    paddingTop?: number;
    isReverseLayout?: boolean;
    isExpand?: boolean;
    isSkillColorize?: boolean;
    isCollapse?: boolean;
    disableSkillDivider?: boolean;
};

const Divider = (heading: string) => (
    <div className="relative flex items-center py-1">
        <div className="flex-grow border-t border-gray-400"></div>
        <span className="flex-shrink mx-4 text-gray-400 text-xs">{heading}</span>
        <div className="flex-grow border-t border-gray-400"></div>
    </div>
);

const DisplaySkills = (
    callInfo: PersonalCallInfo,
    displayJobStatus: boolean,
    displayLanguages: boolean,
    displayHobbies: boolean,
    color?: string,
    isReverseLayout?: boolean,
    isSkillColorize?: boolean,
    isCollapse?: boolean,
    disableDivider: boolean = false,
) => {
    const { job, workAt, major, languages, hobbies } = callInfo;
    if (
        (!displayJobStatus || !job || (!workAt && !major)) &&
        (!displayLanguages || isEmpty(languages)) &&
        (!displayHobbies || isEmpty(hobbies))
    )
        return;

    return (
        <div
            className={classNames([
                styles.skillContainer,
                { [styles.skillColorize]: isSkillColorize },
            ])}>
            {!disableDivider && (
                <>
                    {isCollapse && Divider('Click để thu gọn')}
                    {!isCollapse && Divider('Kĩ năng')}
                </>
            )}

            {displayJobStatus && job && (
                <p>
                    <b className="capitalize">
                        {job ? jobDisplayer[job] : '*Không tìm thấy công việc'}
                    </b>
                    {workAt && ` tại `}
                    {workAt && <b>{workAt || '*Không tìm thấy nơi làm việc'}</b>}
                </p>
            )}
            {displayJobStatus && major && (
                <p>
                    Ngành <b className="capitalize">{major || '*Không có thông tin'}</b>
                </p>
            )}
            {displayLanguages && !isEmpty(languages) && (
                <p>
                    Nói{' '}
                    <b className="capitalize">
                        {languages?.map((lang) => languageDisplayer[lang]).join(', ')}
                    </b>
                </p>
            )}
            {displayHobbies && !isEmpty(hobbies) && (
                <HobbiesCmp
                    hobbies={hobbies!}
                    color={color}
                    isReverseLayout={isReverseLayout}
                />
            )}
        </div>
    );
};

const ProfileInfoCmp: FC<ProfileInfoProps> = ({
    callInfo,
    color,
    paddingTop,
    isReverseLayout,
    isExpand,
    isSkillColorize = false,
    displayName = 'DISPLAY_NAME',
    displayAge = true,
    displayHeight = true,
    displayHobbies = true,
    displayJobStatus = true,
    displayLanguages = true,
    displayOrigin = true,
    displaySex = true,
    isCollapse,
    disableSkillDivider,
}) => {
    const introductionClasses = classNames(styles.introduction, {
        [styles.reverse]: isReverseLayout,
        [styles.expand]: isExpand,
    });
    const styling = {
        color: color,
        paddingTop: paddingTop,
    };
    const icon = callInfo.gender === GENDER.MALE ? maleOutline : femaleOutline;
    const iconColor = callInfo.gender === GENDER.MALE ? 'teal' : 'pink';

    return (
        <div className={introductionClasses} style={styling}>
            <div className={`${styles.name}`}>
                <h6>
                    {displayName === 'DISPLAY_NAME' ? callInfo.name : callInfo.nickname}
                </h6>
                <IonIcon icon={icon} color={iconColor} />
            </div>
            <div className={`${styles.personalInfo}`}>
                {callInfo.birthdate && displayAge && (
                    <p>{getAge(callInfo.birthdate)} tuổi</p>
                )}
                {callInfo.height && displayHeight && <p>{callInfo.height} cm</p>}
                {callInfo.origin && displayOrigin && (
                    <p className="capitalize">{regionDisplayer[callInfo.origin]}</p>
                )}
                {callInfo.sex && callInfo.sex !== SEX.STRAIGHT && displaySex && (
                    <p className="capitalize">{sexDisplayer[callInfo.sex]}</p>
                )}
                {callInfo.mbtiResult && <div className={classNames([styles.badge, styles.mbtiType])}>{'ENFJ'}</div>}
                {DisplaySkills(
                    callInfo,
                    displayJobStatus,
                    displayLanguages,
                    displayHobbies,
                    color,
                    isReverseLayout,
                    isSkillColorize,
                    isCollapse,
                    disableSkillDivider,
                )}
            </div>
        </div>
    );
};

export default ProfileInfoCmp;
