export declare class StorageService {
    private s3;
    getPutUrl(key: string, contentType?: string): Promise<string>;
}
