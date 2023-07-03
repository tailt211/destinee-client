export interface ResultAnswer {
    questionId: string;
    answers: {
        caller: {
            answerId: string;
        };
        receiver: {
            answerId: string;
        };
    };
}