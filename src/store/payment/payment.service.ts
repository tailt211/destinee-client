import moment from 'moment';
import { destineeApi } from '../../https';
import { httpExceptionConverter } from '../../model/exception/http-exception.converter';
import { PaymentDTO } from '../../model/payment/dto/payment.dto';
import { PaymentVnpayREQ } from '../../model/payment/request/payment-vnpay.request';
import { PaymentRESP } from '../../model/payment/response/payment.response';

export const fetchVnpayTransaction = async (body: PaymentVnpayREQ) => {
    try {
        const { data } = await destineeApi.post<PaymentRESP>(`/payments/vnpay-return`, body);
        return {
            gateway: data.payment.gateway,
            description: data.payment.description,
            currency: data.payment.currency,
            amount: data.payment.amount,
            status: data.payment.status,
            payDate: data.payment.payDate ? moment(data.payment.payDate, 'YYYYMMDDHHmmss').toISOString() : undefined,
            package: data.data?.package,
            expiresDate: data.data?.expiresDate,
        } as PaymentDTO;
    } catch (err: any) {
        console.error(err);
        throw httpExceptionConverter(err.response.data, 'Đã có lỗi xảy ra khi lấy tải thông tin giao dịch vnpay');
    }
};
