import { DatetimeChangeEventDetail, IonDatetime } from '@ionic/react';
import moment from 'moment';
import { FC } from 'react';
import styles from './DateTimeModalCmp.module.scss';

const DateTimeModalCmp: FC<{
    title: string;
    prevDate: Date;
    onUpdate: (value: string) => void;
}> = function ({ title, prevDate = new Date(), onUpdate }) {
    const dateChangeHandler = (e: CustomEvent<DatetimeChangeEventDetail>) => {
        if (e.detail.value) onUpdate(e.detail.value as string);
    };
	const maxDate = moment().subtract(18, 'years').format('YYYY-MM-DD');
    return (
        <IonDatetime
            className={styles.customDatePicker}
            value={
                prevDate
                    ? moment(prevDate).format('YYYY-MM-DD')
                    : moment('22/03/2000', 'DD/MM/YYYY').format('YYYY-MM-DD')
            }
            color="teal"
            locale="vi-VN"
            presentation="date"
            onIonChange={dateChangeHandler}
			max={maxDate}
            showDefaultButtons={true}
            showClearButton={true}
            clearText="Về như cũ"
            doneText="Lưu"
            cancelText="Huỷ">
            <div slot="title">{title}</div>
        </IonDatetime>
    );
};

export default DateTimeModalCmp;
