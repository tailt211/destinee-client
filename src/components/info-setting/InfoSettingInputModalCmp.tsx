import { Dialog } from '@headlessui/react';
import { FC, useRef } from 'react';

type InfoSettingInputModalCmpProps = {
    inputName: string;
    inputValue: string;
    onSave: (value: string | undefined | null) => void;
};

const InfoSettingInputModalCmp: FC<InfoSettingInputModalCmpProps> = function ({ inputName, inputValue, onSave }) {
    const inputRef = useRef<HTMLInputElement>(null);
    const saveHandler = () => {
        onSave(inputRef.current?.value);
    };

    return (
        <>
            <div className="bg-white px-4">
                <div className="mt-3">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900 capitalizeFirstLetter">
                        {inputName}
                    </Dialog.Title>
                    <div className="mt-2">
                        <input
                            type="text"
                            defaultValue={inputValue}
                            ref={inputRef}
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-5 pr-3 py-2 border-gray-300 rounded-md bg-stone-700 text-white"
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

export default InfoSettingInputModalCmp;
