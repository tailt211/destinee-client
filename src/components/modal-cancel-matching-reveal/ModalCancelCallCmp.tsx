import { IonButton, IonRippleEffect } from '@ionic/react';
import classNames from 'classnames';
import { FC } from 'react';
import styles from './ModalCancelCallCmp.module.scss';

const ModalCancelCallCmp: FC<{
	className?: any;
	customStyle?: {};
	onCloseCancelCallModal?: () => void;
}> = function ({ className, onCloseCancelCallModal, customStyle }) {
	const cn = classNames([styles.modalCancelCallCmp, { [className]: className }]);

	return (
		<div className={cn} style={customStyle}>
			<span className={styles.title}>Bạn có chắc chắn muốn hủy cuộc gọi này ?</span>
			<div className={styles.actionContainer}>
				<IonButton href="/tabs/home" className={styles.btnAcceptCancel}>
					Huỷ <IonRippleEffect />
				</IonButton>
				<IonButton className={styles.btnDeclineCancel} onClick={onCloseCancelCallModal}>
					Không <IonRippleEffect />
				</IonButton>
			</div>
		</div>
	);
};

export default ModalCancelCallCmp;
