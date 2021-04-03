import { SitesBlocklistServiceInterface } from './sites-blocklist.service.interface';
import { StorageServiceInterface } from '../storage/storage.service.interface';
import { LocalStorageService } from '../storage/local-storage.service';
import parse = require('url-parse');
import isUrl from 'is-url';

export class SitesBlocklistService implements SitesBlocklistServiceInterface {
    private _list: string[] = [];
    private _listKey: string = 'blocklist';

    constructor(
        private _storageService: StorageServiceInterface = new LocalStorageService()
    ) {
        this._updateList().catch((err) => {
            console.error('an error while fetching blocklist at startup', err);
        });

        this.set(['https://vk.com']);
    }

    async isBlocklisted(site: string | undefined): Promise<boolean> {
        if (!site) {
            return false;
        }

        if (!isUrl(site)) {
            return false;
        }

        const url = parse(site, true);

        console.log('url is', url.hostname);
        console.log('list is', this._list);

        return (await this.get()).some((el) => {
            return url.hostname === el;
        });
    }

    async set(list: string[]): Promise<void> {
        this._list = list.map((el) => {
            if (!isUrl(el)) {
                return;
            }

            const url = parse(el, true);

            return url.hostname;
        }).filter((el) => el !== undefined) as string[];

        await this._persistList().catch((err) => {
            console.error('an error while setting blocklist', err);
        });
    }

    async get(): Promise<string[]> {
        try {
            await this._updateList();
        } catch (err) {
            console.error('an error while fetching blocklist at startup', err);
        }

        return [...this._list];
    }

    private async _persistList() {
        await this._storageService.set(this._listKey, this._list);
    }

    private async _updateList() {
       const res = await this._storageService.get<string[]>(this._listKey);

       if (res) {
           this._list = res;
       }
    }
}