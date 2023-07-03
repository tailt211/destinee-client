import { CallHistoryMatchedRESP } from './call-history-matched.response';
import { CallerInfoRESP } from './caller-info.response';

export interface CallInfoRESP {
    callerInfo: CallerInfoRESP;
    callHistory: CallHistoryMatchedRESP;
    isInitializer: boolean;
    revealAvatars: string[];
}

export type CallInfo = CallInfoRESP;
