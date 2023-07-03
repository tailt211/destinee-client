import { PAYMENT_STATUS } from './payment-status.enum';

export const paymentStatusDisplayer: { [key in PAYMENT_STATUS]: { displayer: string, description: string } } = {
    ON_PROGRESS: { displayer: 'Đang thanh toán', description: 'Người dùng đang thanh toán' },
    SUCCEEDED: { displayer: 'Thành công', description: 'Giao dịch đã thành công' },
    FAILED: { displayer: 'Thất bại', description: 'Giao dịch không thành công' },
};
