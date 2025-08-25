
import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService {
  private s3 = new S3Client({
    region: process.env.S3_REGION,
    endpoint: process.env.S3_ENDPOINT,
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY || '',
      secretAccessKey: process.env.S3_SECRET_KEY || '',
    },
  });

  async getPutUrl(key: string, contentType = 'application/octet-stream') {
    const cmd = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET || '',
      Key: key,
      ContentType: contentType,
    });
    return getSignedUrl(this.s3, cmd, { expiresIn: 300 });
  }
}
