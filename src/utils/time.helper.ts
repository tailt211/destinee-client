export const convertSecondToHHMMSS = (duration: number) => {
    const h = Math.floor(duration / 3600);
    const m = Math.floor((duration % 3600) / 60);
    const s = Math.floor((duration % 3600) % 60);
    const hDisplay = h > 0 ? h + ' giờ ' : '';
    const mDisplay = m > 0 ? m + ' phút ' : '';
    const sDisplay = s > 0 ? s + ' giây ' : '';
    return hDisplay + mDisplay + sDisplay;
};

export const getTimeSince = (lastCall: Date) => {
    const dateNow = new Date();
    let diffInMilliSeconds = Math.abs(dateNow.getTime() - lastCall.getTime()) / 1000;
    const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
    diffInMilliSeconds -= minutes * 60;
    const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
    diffInMilliSeconds -= hours * 3600;
    const days = Math.floor(diffInMilliSeconds / 86400);
    diffInMilliSeconds -= days * 86400;
    const months = Math.floor(days / 31);
    const years = Math.floor(months / 12);

    if (years > 0) return `${years} năm`;
    else if (months > 0) return `${months} tháng`;
    else if (days > 0) return `${days} ngày`;
    else if (hours > 0) return `${hours} giờ`;
    else return `${minutes > 0 ? minutes : 1} phút`;
};

export const convertToDateTime = (data?: string, getData?: 'date' | 'time' | 'full-time') => {
    if (!data) return '';
    const dateTime = new Date(data);
    const date = String(dateTime.getDate()).padStart(2, '0');
    const month = String(dateTime.getMonth() + 1).padStart(2, '0')
    const year = dateTime.getFullYear();
    const hour = String(dateTime.getHours()).padStart(2, '0');
    const minute = String(dateTime.getMinutes()).padStart(2, '0');;
    const second = String(dateTime.getSeconds()).padStart(2, '0');;
    const displayDate = `${date}/${month}/${year}`;
    const displayTime = `${hour}:${minute}`;
    if (getData === 'date') return displayDate;
    if (getData === 'time') return displayTime;
    if (getData === 'full-time') return `${displayTime}:${second}`;
    return `${displayDate} - ${displayTime}`;
};
