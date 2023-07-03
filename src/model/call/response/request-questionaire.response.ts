type CallerCallInfoRESP = {
    clientId: string;
    isRequestedQuestionaire: boolean;
};

export interface RequestQuestionaireRESP {
    callerOne: CallerCallInfoRESP;
    callerTwo: CallerCallInfoRESP;
}