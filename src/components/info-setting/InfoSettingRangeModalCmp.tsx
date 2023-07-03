import { Dialog } from '@headlessui/react';
import { IonRange } from '@ionic/react';
import { FC, useRef } from 'react';
import styles from './InfoSettingRangeModalCmp.module.scss';

type InfoSettingRangeModalCmpProps = {
    inputName: string;
    inputValue: [number, number];
    onSave: (value: [number, number]) => void;
    min?: number;
    max?: number;
};

const InfoSettingRangeModalCmp: FC<InfoSettingRangeModalCmpProps> = function ({ inputName, inputValue, onSave, min, max }) {
    const rangeRef = useRef<HTMLIonRangeElement>(null);
    const saveHandler = () => {
        const rangeValue = rangeRef.current?.value as { lower: number; upper: number };
        onSave([rangeValue.lower, rangeValue.upper]);
    };

    return (
        <>
            <div className="bg-white px-4">
                <div className="mt-3">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900 capitalizeFirstLetter">
                        {inputName}
                    </Dialog.Title>
                    <div className="mt-2">
                        <IonRange
                            ref={rangeRef}
                            id={styles.myRange}
                            dualKnobs={true}
                            value={{
                                lower: inputValue[0] || 5,
                                upper: inputValue[1] || 80,
                            }}
                            min={min || 0}
                            max={max || 100}
                            pin={true}
                            ticks={true}
                            snaps={true}
                        />
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 mt-3 sm:flex sm:flex-row-reverse">
                <button
                    type="button"
                    className="w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-10 py-2 bg-teal-700 text-base font-medium text-white hover:bg-teal-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-700"
                    onClick={saveHandler}>
                    Lưu
                </button>
            </div>
        </>
    );
};

export default InfoSettingRangeModalCmp;
