export interface FriendRequestCreateRESP {
    _id: string;
    createdAt: string;
    updatedAt: string;
    requester: {
        _id: string;
    };
    verifier: {
        _id: string;
    };
    status: string;
}
