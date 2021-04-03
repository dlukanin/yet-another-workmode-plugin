export interface SitesBlocklistServiceInterface {
    get(): Promise<string[]>;
    set(list: string[]): Promise<void>;
    isBlocklisted(site: string): Promise<boolean>;
}