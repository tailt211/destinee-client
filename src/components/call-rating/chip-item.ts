import { reviewDisplayer } from "../../model/call/review-displayer";
import { REVIEW } from "../../model/call/review.enum";

export type ChipItem = { key: REVIEW; displayer: string; baseColor?: string; activeColor?: string };
export const chipList: ChipItem[] = Object.keys(REVIEW).map((key) => {
    return {
        key: REVIEW[key],
        ...reviewDisplayer[key],
    } as ChipItem;
});