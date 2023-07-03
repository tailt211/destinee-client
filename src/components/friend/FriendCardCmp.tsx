import moment from 'moment';
import { Link } from 'react-router-dom';
import { ImageDTO } from '../../model/image/dto/image.dto';
import { getAvatar } from '../../model/image/image.helper';
import { TYPE_IMAGE } from '../../model/image/type-image.enum';
import { GENDER, JOB, REGION } from '../../model/profile/profile.constant';
import ProfileInfoCmp from '../profile/profile-card/ProfileInfoCmp';
import styles from './FriendCardCmp.module.scss';
import slugify from 'slugify';
import { PATHS } from '../../router/paths';
import { MbtiResultDTO } from '../../model/personality-test/dto/mbti-result.dto';

const FriendCardCmp: React.FC<{
    id: string;
    name: string;
    gender: GENDER;
    birthdate: string;
    avatar?: ImageDTO | string;
    hobbies?: string[];
    origin?: REGION;
    job?: JOB;
    workAt?: string;
    major?: string;
    mbtiResult: MbtiResultDTO | null;
}> = ({ id, birthdate, gender, name, avatar, hobbies, origin, job, workAt, major, mbtiResult }) => {
    return (
        <Link to={`/${PATHS.FRIEND}/${id}/${slugify(name, { lower: true })}`} className={styles.container}>
            <div className={styles.avatarWrapper}>
                <div className={styles.avatarLayer}>
                    <img src={getAvatar(avatar, TYPE_IMAGE.SQUARE, gender)} alt="avatar" />
                </div>
            </div>
            <ProfileInfoCmp
                callInfo={{
                    name: name,
                    gender: gender,
                    mbtiResult,
                    /* Optional */
                    birthdate: moment(birthdate).toDate(),
                    job: job,
                    workAt: workAt,
                    major: major,
                    origin: origin,
                    hobbies: hobbies,
                    
                }}
                color="var(--ion-color-white)"
                paddingTop={0}
                disableSkillDivider={true}
            />
        </Link>
    );
};

export default FriendCardCmp;
