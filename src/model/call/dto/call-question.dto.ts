import { CallQuestionAnswerDTO } from './call-question-answer.dto';

export interface CallQuestionDTO {
    title: string;
    id: string;
    answers: CallQuestionAnswerDTO[];
}
