import { PersonalityTestCreateDTO } from './../../model/personality-test/dto/personality-test-create.dto';
import { destineeApi } from '../../https';
import { httpExceptionConverter } from '../../model/exception/http-exception.converter';
import { PersonalityTestDTO } from '../../model/personality-test/dto/personality-test.dto';
import { MBTI_ANSWER } from '../../model/personality-test/mbti-answer.enum';
import { PERSONALITY_TEST_PROCESSING_STATE } from '../../model/personality-test/personality-test-processing-state.enum';
import { PersonalityTestSubmitREQ } from '../../model/personality-test/request/personality-test-submit.request';
import { PersonalityTestCreateRESP } from '../../model/personality-test/response/personality-test-create.response';
import { PersonalityTestRESP } from '../../model/personality-test/response/personality-test.response';

export const fetchPersonalityTest = async (id: string) => {
    try {
        const data = (await destineeApi.get<PersonalityTestRESP>(`/mbti-tests/${id}`))
            .data;
        return {
            id: data._id,
            createdAt: data.createdAt,
            answers: data.answers.map((item) => ({
                questionId: item.questionId,
                answer: MBTI_ANSWER[item.answer],
            })),
            numberOfAnswers: data.numberOfAnswers,
            processingState: PERSONALITY_TEST_PROCESSING_STATE[data.processingState],
            result: data.result || null,
        } as PersonalityTestDTO;
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(
            err.response.data,
            'Đã có lỗi xảy ra khi tải chi tiết bài trắc nghiệm tính cách',
        );
    }
};

export const submitPersonalityAnswerTest = async (id: string, body: PersonalityTestSubmitREQ) => {
    try {
        await destineeApi.patch(`/mbti-tests/${id}`, body);
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(
            err.response.data,
            'Đã có lỗi xảy ra khi nộp đáp án bài trắc nghiệm tính cách',
        );
    }
};
export const createPersonalityTest = async () => {
    try {
        const data = (await destineeApi.post<PersonalityTestCreateRESP>(`/mbti-tests`))
            .data;
        return {
            id: data.id,
            deletedCount: data.deletedCount,
        } as PersonalityTestCreateDTO;
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(
            err.response.data,
            'Đã có lỗi xảy ra khi tạo mới bài trắc nghiệm tính cách',
        );
    }
};
