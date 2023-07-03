import { destineeApi } from '../../https';
import { CallReviewREQ } from '../../model/call/request/call-review.request';
import { httpExceptionConverter } from '../../model/exception/http-exception.converter';

export const reviewCall = async (id: string, body: CallReviewREQ) => {
    try {
        await destineeApi.patch<void>(`/call-histories/${id}/review`, body);
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(
            err.response.data,
            'Đã có lỗi xảy ra khi đánh giá cuộc gọi',
        );
    }
};
