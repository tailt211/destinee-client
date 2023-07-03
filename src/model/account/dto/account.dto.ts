import { PACKAGE } from "../packages.enum";
import { ROLE } from "../roles.enum";

export interface AccountUpgrade {
    package: PACKAGE;
    expiresDate: string;
}

export interface AccountDTO {
    id: string;
    uid: string;
    profileId?: string;
    role: ROLE;
    disabled: boolean;
    upgrade?: AccountUpgrade;
}