export interface ConversationRESP {
    id: string;
    isSeen: boolean;
    lastMessage: string;
    lastMessageAt?: string;
    other: {
        profileId: string;
        avatar: string;
        name: string;
        gender: boolean;
        disabled: boolean;
    };
}
