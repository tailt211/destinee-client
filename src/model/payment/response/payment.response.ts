export type PaymentRESP = {
    payment: {
        gateway: string;
        description: string;
        currency: string;
        amount: number;
        status: string;
        payDate?: string;
    };
    data?: {
        package: string;
        expiresDate: string;
    };
};
