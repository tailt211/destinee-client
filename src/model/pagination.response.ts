export type PaginationRESP<T> = {
    results: T[];
    page: number;
    limit: number;
    count: number;
    totalPage: number;
    totalCount: number;
};
