import { S3Client } from '@aws-sdk/client-s3';

const globalForS3 = global as unknown as { s3: S3Client };

export const s3Client =
    globalForS3.s3 ||
    new S3Client({
        region: 'us-east-1', // MinIO requires a region, but it doesn't matter which one
        endpoint: process.env.MINIO_ENDPOINT || 'http://localhost:9000',
        forcePathStyle: true, // Required for MinIO
        credentials: {
            accessKeyId: process.env.MINIO_ROOT_USER || 'minioadmin',
            secretAccessKey: process.env.MINIO_ROOT_PASSWORD || 'minioadmin',
        },
    });

if (process.env.NODE_ENV !== 'production') globalForS3.s3 = s3Client;

export const BUCKET_NAME = 'recruitkart-media';
