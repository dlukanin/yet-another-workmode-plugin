import { SitesBlocklistService } from '../services/sites-blocklist/sites-blocklist.service';
import TabChangeInfo = chrome.tabs.TabChangeInfo;
import Tab = chrome.tabs.Tab;

export class BlocklistWorker {
    constructor(
        private _sitesBlocklistService: SitesBlocklistService = new SitesBlocklistService()
    ) {
    }

    bootstrap(): void {
        chrome.tabs.onUpdated.addListener( (tabId: number, changeInfo: TabChangeInfo, tab: Tab) => {
            this._sitesBlocklistService.isBlocklisted(changeInfo.url ?? tab.url)
                .then((res) => {
                    if (res) {
                        chrome.tabs.remove(tabId);
                    }
                }).catch((err) => {
                    console.error('an error in updated tab handler', err);
                });
        });
    }
}