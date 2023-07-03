import classNames from 'classnames';
import { FC, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import styles from './ModalPersonalityTestCpm.module.scss';

interface Steps {
	title?: String
	description?: String
}

const steps: Steps[] = [
	{},
	{
		description: "Chào Thịnh, xin lỗi vì đã cắt ngang"
	},
	{
		description: "Destinee có điều muốn nói với bạn"
	},
	{
		description: "Bạn có muốn mất hàng giờ để gọi điện hết người này đến người khác, mà chẳng ai thực sự mang lại sự thoải mái cho mình không?"
	},
	{
		description: "Bạn có muốn tâm sự với người không thể đồng cảm với câu chuyện của mình không?"
	},
	{
		description: "Destinee biết là bạn không muốn điều đó"
	},
	{
		description: "Để giúp bạn có thể tìm được người phù hợp nhất để trò chuyện"
	},
	{
		description: "Hệ thống sẽ ưu tiên kết nối bạn với những người có tính cách phù hợp với con người của bạn"
	},
	{
		description: "Nhưng để hệ thống làm được điều này, bạn phải cùng hợp tác để giúp chúng tôi hiểu rõ về tính cách, con người của bạn hơn"
	},
	{
		title: "Trắc nghiệm tính cách",
		description: " Bạn cần phải làm 60 câu trắc nghiệm tính cách"
	},
	{
		title: "Lưu ý khi trả lời câu hỏi",
	},
	{
		title: "Disclaimer",
		description: "Bài trắc nghiệm không nói lên 100% con người của bạn & nó không quyết định gì đến trải nghiệm của bạn với người khác. Mọi thứ chỉ dùng để hỗ trợ"
	}
]

const AUTO_STEP = 8;

const ModalPersonalityTestCpm: FC<{
	ModalPersonalityTestCpmClassName?: any;
	customStyle?: {};
}> = function ({ ModalPersonalityTestCpmClassName, customStyle }) {

	const history = useHistory();

	const [step, setStep] = useState(0);
	const [title, setTitle] = useState(steps[step].title);
	const [description, setDescription] = useState(steps[step].description);

	const [countDown, setCountDown] = useState(4);

	useEffect(() => {
		const interval = setInterval(() => {
			if (step === 0) {
				setStep((prev) => prev + 1);
			};
		}, 3000);

		return () => clearInterval(interval);
	}, [step]);

	// set information after step change
	useEffect(() => {
		if (step < steps.length) {
			setTitle(steps[step].title);
			setDescription(steps[step].description);
		}
	}, [step]);

	// countdown timer
	useEffect(() => {
		const interval = setInterval(() => {
			if (step > 0 && step < AUTO_STEP) {
				if (countDown === 1) {
					setCountDown(4);
					setStep((prev) => prev + 1);
				}
				else setCountDown((pre) => pre - 1);
			}
			else if (step === AUTO_STEP) {
				if (countDown > 0) setCountDown((pre) => pre - 1);
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [countDown, step])

	const onClickToNextStep = () => {
		if (step < steps.length - 1) {
			setStep((prev) => prev + 1);
			if (step < AUTO_STEP) {
				setCountDown(4);
			}
		} else {
			// ----------------------------------------------------------------------------------------------------------------------------------------------------------
			// change link to personality quiz  -------------------------------------------------------------------------------------------------------------
			history.replace({ pathname: "/tabs/home", state: undefined })
		}
	}

	const cn = classNames([styles.ModalPersonalityTestCpm, {
		[ModalPersonalityTestCpmClassName]: ModalPersonalityTestCpmClassName
	}]);

	const contentContainerClassnames = classNames([styles.contentContainer, {
		[styles.contentOapcityAnimation]: step === 9,
		[styles.contentMoveToTopAnimation]: step === 10,
		[styles.contentMoveToBottomAnimation]: step === 11,
	}]);

	return (
		<div className={cn} style={customStyle} onClick={() => step > 0 && onClickToNextStep()}>
			<div className={contentContainerClassnames}>
				{title && <span className={styles.title}>{title}</span>}
				{description && <span className={step > AUTO_STEP ? styles.description : styles.descriptionAuto}>
					{description}
				</span>
				}
				{step === 10 && <div className={styles.descriptionContainer}>
					<span>Hãy giữ tâm trạng của mình ổn định, không quá vui cũng đừng quá buồn</span>
					<span>Đừng trả lời theo những gì bạn muốn người khác nghĩ về bạn</span>
					<span>Hãy lời thành thật theo những gì bạn đã thực hiện trong quá khứ hoặc thứ đầu tiên bạn sẽ làm nếu trường hợp đó xảy ra</span>
				</div>}
				{step > AUTO_STEP &&
					<span className={styles.action}>
						{step === steps.length - 1 ? "Nhấp để bắt đầu" : "Nhấp để tiếp tục"}
					</span>}
			</div>

			{step > 0 && step < 9 &&
				< div className={styles.bottomActionContainer}>
					<span className={styles.action}>Nhấp để tiếp tục</span>
					<div className={styles.countdownContainer}>{countDown}</div>
				</div>
			}
		</div >
	);
};

export default ModalPersonalityTestCpm;
