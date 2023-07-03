import { REVIEW } from "../review.enum";

export interface CallReviewREQ {
    callerId: string;
    rates: number;
    reviews: REVIEW[];
}
