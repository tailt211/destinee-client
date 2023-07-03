import { PAYMENT_GATEWAY } from "./payment-gateway.enum";

export const paymentGatewayDisplayer: { [key in PAYMENT_GATEWAY]: { displayer: string } } = {
    VNPAY: { displayer: 'Ví Vnpay' },
};