import { StorageService } from './storage.service';
export declare class StorageController {
    private svc;
    constructor(svc: StorageService);
    getPutUrl(key: string, contentType?: string): Promise<string>;
}
