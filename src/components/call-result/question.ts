import { QuestionAnswer } from "./question-answer";

export interface Question {
    id: string;
    title: string;
    answers: QuestionAnswer[];
}