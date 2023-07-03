import { Question } from '../../model/question';

const QUESTIONS: Question[] = [
    {
        question: 'Trong lần hẹn hò đầu tiên ai sẽ là người trả tiền',
        answers: [
            { id: 'ANS_11', answer: 'Đàn ông sẽ là người trả' },
            { id: 'ANS_12', answer: 'Phụ nữ sẽ là người trả' },
            { id: 'ANS_13', answer: 'Cả 2 chia tiền' },
            {
                id: 'ANS_14',
                answer: 'Không trả tiền, giả vờ đã trả tiền rồi chạy trốn',
            },
        ],
    },
    {
        question: 'Hiền Hồ quen với bồ đại gia đã có gia đình là đúng hay sai',
        answers: [
            { id: 'ANS_21', answer: 'Đúng' },
            { id: 'ANS_22', answer: 'Sai' },
            { id: 'ANS_23', answer: 'Không phải chuyện của mình' },
            {
                id: 'ANS_24',
                answer: 'Hiền Hồ không phải người sai mà người sai là ông đại gia',
            },
        ],
    },
    {
        question: 'Trung Thịnh là người đẹp trai nhất thế giới',
        answers: [
            { id: 'ANS_31', answer: 'Tôi không dồng ý' },
            { id: 'ANS_32', answer: 'Sai' },
            { id: 'ANS_33', answer: 'Không phải chuyện của mình' },
            {
                id: 'ANS_34',
                answer: 'Tôi yêu anh ấy',
            },
        ],
    },
];

export const fetchQuestions: () => Promise<Question[]> = () => {
    /* Fake Async API */
    return new Promise((res, rej) => {
        setTimeout(() => {
            res(QUESTIONS);
        }, 1500);
    });
};
