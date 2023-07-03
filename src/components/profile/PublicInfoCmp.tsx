import { FC } from 'react';
import { useSelector } from 'react-redux';
import { PersonalCallInfo } from '../../model/call-information';
import { RootState } from '../../store';
import { ProfileState } from '../../store/profile/profile.slice';
import FavoritesCmp, { FavoriteType } from './FavoritesCmp';
import ProfileInfoCmp from './profile-card/ProfileInfoCmp';
import {
    favoriteMoviesDisplayer,
    favoriteSongsDisplayer,
} from './profile-favorite.helper';
import { CallInfoVisibility } from './profile.type';
import styles from './PublicInfoCmp.module.scss';

type PublicInfoCmpProps = CallInfoVisibility & {
    callInfo: PersonalCallInfo;
    avatar: string;
    isSkillColorize?: boolean;
};

const PublicInfoCmp: FC<PublicInfoCmpProps> = ({
    callInfo,
    avatar,
    displayName,
    displayAge,
    displayHeight,
    displayHobbies,
    displayJobStatus,
    displayLanguages,
    displayOrigin,
    displaySex,
    isSkillColorize,
}) => {
    const { callSetting, ...profile } = useSelector(
        (state: RootState) => state.profile,
    ) as ProfileState;

    const favorites: FavoriteType[] = [
        {
            title: 'Bài nhạc yêu thích',
            type: 'song',
            items: favoriteSongsDisplayer(profile.personalInfo.favoriteSongs),
        },
        {
            title: 'Bộ phim yêu thích nhất',
            type: 'movie',
            items: favoriteMoviesDisplayer(profile.personalInfo.favoriteMovies),
        },
    ];

    return (
        <div className={`${styles.publicInformation}`}>
            <div className={`${styles.header}`}>
                <div className={`${styles.imageWrapper}`}>
                    <img src={avatar} alt="avatar" />
                </div>
                <ProfileInfoCmp
                    callInfo={callInfo}
                    displayName={displayName}
                    displayAge={displayAge}
                    displayHeight={displayHeight}
                    displayHobbies={displayHobbies}
                    displayJobStatus={displayJobStatus}
                    displayLanguages={displayLanguages}
                    displayOrigin={displayOrigin}
                    displaySex={displaySex}
                    isSkillColorize={isSkillColorize}
                />
            </div>
            <div className={`${styles.content}`}>
                {favorites.map((favorite) => (
                    <FavoritesCmp
                        title={favorite.title}
                        type={favorite.type}
                        items={favorite.items}
                        key={favorite.title}
                    />
                ))}
            </div>
        </div>
    );
};

export default PublicInfoCmp;
