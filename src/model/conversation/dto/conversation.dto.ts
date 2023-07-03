import { ImageDTO } from '../../image/dto/image.dto';
import { GENDER } from '../../profile/profile.constant';

export interface ConversationDTO {
    id: string;
    isSeen: boolean;
    lastMessage: string;
    other: {
        profileId: string;
        avatar: string | ImageDTO | undefined;
        name: string;
        gender: GENDER;
        disabled: boolean;
    };
    lastMessageAt?: string;
}
