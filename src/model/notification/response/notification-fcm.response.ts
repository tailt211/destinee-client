export interface NotificationFcmRESP {
    id: string;
    isSeen: string;
    type: string;
    'data.id': string;
    'data.profileId': string;
    'data.profileName': string;
    'data.content': string;
    'data.thumbnail': string;
}
