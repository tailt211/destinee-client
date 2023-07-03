import { FRIEND_REQUEST_STATUS } from "../friend-request-status.enum";

export interface FriendRequestCreate {
    id: string;
    requesterId: string;
    verifierId: string;
    status: FRIEND_REQUEST_STATUS;
}