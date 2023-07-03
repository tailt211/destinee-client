import { PACKAGE } from "./account/packages.enum";

export const packageDisplayer: { [key in PACKAGE]: { displayer: string; serviceDesc: string  } } = {
    PREMIUM: { displayer: 'thành viên', serviceDesc: 'Gói thành viên 1 tháng' },
};