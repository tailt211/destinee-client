export interface MessageDTO {
    id: string;
    content: string;
    createdAt: string;
    isMine: boolean;
    isLastMessage?: boolean;
}
