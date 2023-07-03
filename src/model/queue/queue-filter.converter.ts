import { TOPIC } from '../call/topic.enum';
import { GENDER, LANGUAGE, REGION, SEX } from '../profile/profile.constant';
import { QueueFilterDTO } from './dto/queue-filter.dto';
import { QueueFilterRESP } from './response/queue-suggested-filter.response';

export const queueFilterConverter = (filter: QueueFilterRESP) => {
    return {
        gender: filter.gender ? GENDER.MALE : GENDER.FEMALE,
        ageRange: filter.ageRange,
        language: filter.language ? LANGUAGE[filter.language] : null,
        origin: filter.origin ? REGION[filter.origin] : null,
        sex: filter.sex ? SEX[filter.sex] : null,
        topic: filter.topic ? TOPIC[filter.topic] : null,
    } as QueueFilterDTO;
};
