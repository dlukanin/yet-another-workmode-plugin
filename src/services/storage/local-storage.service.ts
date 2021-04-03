import { StorageServiceInterface } from './storage.service.interface';

export class LocalStorageService implements StorageServiceInterface {
    async get<T>(key: string): Promise<T | undefined> {
        const result = localStorage.getItem(key);

        if (result === null) {
            return;
        }

        return JSON.parse(result);
    }

    async set<T>(key: string, value: T): Promise<void> {
        localStorage.setItem(key, JSON.stringify(value));
    }

}