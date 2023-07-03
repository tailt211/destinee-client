export interface QueueFilterRESP {
    gender: boolean;
    origin: string | null;
    ageRange: [number, number];
    topic: string | null;
    language: string | null;
    sex: string | null;
}

export interface QueueTrendSuggestedFilterRESP {
    trendFilter: QueueFilterRESP;
    lastFilter: QueueFilterRESP;
    token: string;
}
