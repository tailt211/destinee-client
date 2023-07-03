import { QueueFilterREQ } from "./queue-filter.request";

export interface QueueContinueREQ {
    token: string;
    filter: QueueFilterREQ;
    isNoneChange: boolean;
}