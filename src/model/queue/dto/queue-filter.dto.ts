import { TOPIC } from "../../call/topic.enum";
import { GENDER, LANGUAGE, REGION, SEX } from "../../profile/profile.constant";

export interface QueueFilterDTO {
    gender: GENDER;
    origin: REGION | null;
    ageRange: [number, number];
    topic: TOPIC | null;
    language: LANGUAGE | null;
    sex: SEX | null;
}