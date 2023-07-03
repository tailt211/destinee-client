import { CallerInfoRESP } from "./caller-info.response";

export interface CallFindingRESP {
    queue: number;
    randomCallerInfoList: CallerInfoRESP[];
}
