import { PersonalInfoDTO } from '../../model/profile/dto/profile-personal-info.dto';
import { ProfileDTO } from '../../model/profile/dto/profile.dto';

export type Friend = Pick<ProfileDTO, '_id' | 'name' | 'avatar'> &
    Partial<Pick<PersonalInfoDTO, 'birthdate' | 'gender' | 'job' | 'workAt' | 'major' | 'hobbies' | 'origin'>>;
