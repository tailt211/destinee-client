import { NOTIFICATION_TYPE } from "../notification-type";

export interface NotificationDTO {
    id: string;
    createdAt: string;
    isSeen: boolean;
    type: NOTIFICATION_TYPE;
    data?: {
        id: string;
        profileId: string | null;
        profileName: string | null;
        content: string | null;
        thumbnail: string | null;
    };
}
