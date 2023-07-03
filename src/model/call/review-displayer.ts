import { REVIEW } from './review.enum';

const goodColors = { baseColor: 'rgb(109 207 177)', activeColor: '#43b794' };
const mediumColors = { baseColor: 'rgb(249 241 49)', activeColor: '#43b794' };
const badColors = { baseColor: 'rgb(209 133 126)', activeColor: '#43b794' };

export const reviewDisplayer: { [key in REVIEW]: { displayer: string; baseColor: string; activeColor: string } } = {
    KNOWLEDGE: { displayer: 'hiểu biết', ...goodColors },
    MATURE: { displayer: 'trưởng thành', ...goodColors },
    DELICATED: { displayer: 'tinh tế', ...goodColors },
    INTERESTING: { displayer: 'thú vị', ...goodColors },
    CONFIDENT: { displayer: 'tự tin', ...goodColors },
    CUTE: { displayer: 'dễ thương', ...goodColors },
    GENTLE: { displayer: 'dịu dàng', ...goodColors },
    NICE_VOICE: { displayer: 'giọng hay', ...goodColors },
    HILARIOUS: { displayer: 'hài hước', ...goodColors },
    FRIENDLY: { displayer: 'thân thiện', ...goodColors },
    QUITE: { displayer: 'ít nói', ...mediumColors },
    BIG_MOUTH: { displayer: 'nói quá nhiều', ...mediumColors },
    UNMATURE: { displayer: 'chưa trưởng thành', ...mediumColors },
    PASSIVE: { displayer: 'ít chủ động', ...mediumColors },
    SHY: { displayer: 'ngại ngùng', ...mediumColors },
    HEN_PECKED: { displayer: 'chưa có chính kiến', ...mediumColors },
    UNCOMFORTABLE: { displayer: 'không thoải mái', ...mediumColors },
    BORING: { displayer: 'nhạt nhẻo', ...badColors },
    COLD: { displayer: 'lạnh lùng', ...badColors },
    UNPLEASANT: { displayer: 'khó chịu', ...badColors },
    GRUFF: { displayer: 'thô lỗ', ...badColors },
    HARASS: { displayer: 'quấy rối', ...badColors },
    BOAST: { displayer: 'khoe khoang', ...badColors },
    IMPOLITE: { displayer: 'bất lịch sự', ...badColors },
};
