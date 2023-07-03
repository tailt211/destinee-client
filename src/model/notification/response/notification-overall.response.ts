export interface NotificationOverallRESP {
    id: string;
    createdAt: string;
    isSeen: boolean;
    type: string;
    data?: {
        id: string;
        profileId: string | null;
        profileName: string | null;
        content: string | null;
        thumbnail: string | null;
    };
}
