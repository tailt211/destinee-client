interface UpgradeRESP {
    package: string;
    expiresDate: string;
}

export interface AccountRESP {
    _id: string;
    profile?: string;
    email: string;
    uid: string;
    role: string;
    disabled: boolean;
    upgrade?: UpgradeRESP;
}
