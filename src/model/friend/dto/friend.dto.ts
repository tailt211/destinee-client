import { PersonalInfoDTO } from '../../profile/dto/profile-personal-info.dto';
import { ProfileDTO } from '../../profile/dto/profile.dto';
import { PageSettingDTO } from '../../profile/dto/profile-page-setting.dto';

export type FriendDTO = { id: string, conversationId : string | null } & Pick<ProfileDTO, 'name' | 'avatar' | 'mbtiResult'> &
    Omit<PersonalInfoDTO, 'favoriteSongs' | 'favoriteBooks' | 'favoriteMovies'> & Pick<PageSettingDTO, 'bio'>;
