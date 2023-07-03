import { PACKAGE } from "../../account/packages.enum";
import { PAYMENT_CURRENCY } from "../payment-currency.enum";
import { PAYMENT_GATEWAY } from "../payment-gateway.enum";
import { PAYMENT_STATUS } from "../payment-status.enum";

export interface PaymentDTO {
    gateway: PAYMENT_GATEWAY;
    description: string;
    currency: PAYMENT_CURRENCY;
    amount: number;
    status: PAYMENT_STATUS;
    package?: PACKAGE;
    expiresDate: string;
    payDate?: string;
}
