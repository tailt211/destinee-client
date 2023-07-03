import { Dialog, Transition } from '@headlessui/react';
import { FC, Fragment } from 'react';

type ModalContainerCmpProps = {
    open: boolean;
    onClose?: (open: boolean) => void;
    dialogPanelClasses?: string;
};

const ModalContainerCmp: FC<ModalContainerCmpProps> = function ({
    open,
    onClose,
    children,
    dialogPanelClasses,
}) {
    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose || (() => {})}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-zinc-900 bg-opacity-80 transition-opacity" />
                </Transition.Child>

                <div className="fixed z-10 inset-0 overflow-y-auto">
                    <div
                        className="flex items-center center justify-center mt-14 p-4 text-center m-auto"
                        style={{ maxWidth: '500px' }}>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                            <Dialog.Panel className={dialogPanelClasses}>
                                {children}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default ModalContainerCmp;
