export type RegAnswerKey = 'name' | 'nickname' | 'origin' | 'gender' | 'sex' | 'birthdate' | 'height' | 'languages' | 'job' | 'workAt' | 'major';

export interface RegistrationSubmitREQ {
    answerKey: RegAnswerKey;
    value: string | string[] | number | boolean | null;
}
