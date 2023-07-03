import { LANGUAGE, REGION, SEX } from "../../profile/profile.constant";
import { TOPIC } from "../../call/topic.enum";

export interface QueueFilterREQ {
    gender: boolean;
    origin: REGION | null;
    ageRange: [number, number];
    topic: TOPIC | null;
    language: LANGUAGE | null;
    sex: SEX | null;
}
