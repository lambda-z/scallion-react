

export interface ScallionStorageAdapter {
    set(key: string, value: string): Promise<void>;
    get(key: string): Promise<string | null>;
    remove(key: string): Promise<void>;
}


let storageAdapter: ScallionStorageAdapter | null = null;

export function setScallionStorageAdapter(adapter: ScallionStorageAdapter) {
    storageAdapter = adapter;
}

export function getScallionStorageAdapter(): ScallionStorageAdapter {
    if (!storageAdapter) {
        throw new Error('Scallion storage adapter is not configured.');
    }
    return storageAdapter;
}
