import classNames from 'classnames';
import { FC } from 'react';
import ProfileInfoCmp from './ProfileInfoCmp';
import styles from './ProfileCardCmp.module.scss';
import { PersonalCallInfo } from '../../../model/call-information';

type ProfileCardCmpProps = {
    callInfo: PersonalCallInfo;
    avatar: string;
    setBlurBackground?: boolean;
    fixHeight?: string;
    isReverseLayout?: boolean;
    color?: string;
    isExpand?: boolean;
    isCollapse?: boolean;
};

const ProfileCardCmp: FC<ProfileCardCmpProps> = ({
    callInfo,
    avatar,
    setBlurBackground,
    color,
    fixHeight,
    isReverseLayout,
    isExpand,
    isCollapse
}) => {
    const profileCardClasses = classNames([
        styles.profileCard,
        { [styles.fixHeight]: fixHeight },
        { [styles.blurBackground]: setBlurBackground },
        { [styles.reverse]: isReverseLayout },
    ]);

    const reverseExpandClasses = classNames([
        styles.infoWrapper,
        { [styles.reverse]: isReverseLayout },
    ]);
    const reverseContentClasses = classNames([
        styles.expandButton,
        { [styles.reverseContent]: isReverseLayout },
    ]);

    return (
        <div
            className={profileCardClasses}
            style={{ height: fixHeight || 'fit-content' }}
        >
            <div className={styles.imageWrapper} style={{ height: fixHeight }}>
                <img src={avatar} alt="public-avatar" />
            </div>
            <div className={reverseExpandClasses}>
                <ProfileInfoCmp
                    callInfo={callInfo}
                    color={color}
                    isReverseLayout={isReverseLayout}
                    isExpand={isExpand}
                    isCollapse={isCollapse}
                />

                {isExpand && (
                    <p className={reverseContentClasses}>Nhấp để xem thêm</p>
                )}
            </div>
        </div>
    );
};

export default ProfileCardCmp;
