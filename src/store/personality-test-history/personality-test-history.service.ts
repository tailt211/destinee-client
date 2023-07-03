import { PERSONALITY_TEST_PROCESSING_STATE } from '../../model/personality-test/personality-test-processing-state.enum';
import { PersonalityTestHistoryDTO } from '../../model/personality-test/dto/personality-test-history.dto';
import { destineeApi } from '../../https';
import { httpExceptionConverter } from '../../model/exception/http-exception.converter';
import { PersonalityTestHistoryRESP } from '../../model/personality-test/response/personality-test-history.response';

export const fetchPersonalityTestHistories = async () => {
    try {
        const data = (await destineeApi.get<PersonalityTestHistoryRESP[]>(`/mbti-tests`))
            .data;
        return data.map((mbti) => ({
            id: mbti._id,
            createdAt: mbti.createdAt,
            numberOfAnswers: mbti.numberOfAnswers,
            processingState: PERSONALITY_TEST_PROCESSING_STATE[mbti.processingState],
            result: mbti.result || null,
        })) as PersonalityTestHistoryDTO[];
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(
            err.response.data,
            'Đã có lỗi xảy ra khi tải lịch sử bài trắc nghiệm tính cách',
        );
    }
};
