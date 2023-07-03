import moment from "moment";

export const getAge = (birthdate: Date) => {
    var today = new Date();
    var age = today.getFullYear() - birthdate.getFullYear();
    var m = today.getMonth() - birthdate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthdate.getDate())) {
        age--;
    }
    return age;
};

export const getDateOnly = (date: Date | string) => {
    return moment(moment(date).startOf('day').format('LL')).startOf('day').toDate();
}

export const secondToTimerFormat = (seconds: number, isHourFormat: boolean = false) => {
    const date = new Date(seconds * 1000).toISOString();
    return isHourFormat ? date.slice(11, 19) : date.slice(14, 19);
}