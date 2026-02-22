
export interface ScallionPage<T> {
    records: T[];
    total: number;
    current: number;
    size: number;
    pages: number;
}


export const defaultScallionPage: ScallionPage<any> = {
    current: 1,
    pages: 0,
    records: [],
    size: 10,
    total: 0
}
