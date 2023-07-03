import { destineeApi } from '../../https';

import { httpExceptionConverter } from '../../model/exception/http-exception.converter';

export const generatePremiumOrder = async () => {
    try {
        const { data } = await destineeApi.post<string>(`/orders/premium`);
        return data;
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi tạo đơn hàng');
    }
};
