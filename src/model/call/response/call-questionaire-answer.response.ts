export interface CallQuestionaireAnswerRESP {
    clientOneId: string;
    clientTwoId: string;
    result: {
        matchingPercentage: number;
        questions: {
            callerOneAnswerId: string;
            callerTwoAnswerId: string;
            question: string;
        }[];
        _id: string;
    }
}