export interface CallHistoryMatchedRESP {
    _id: string;
    questions: {
        question: string;
        title: string;
        answers: {
            answer: string;
            title: string;
        }[];
    }[];
}