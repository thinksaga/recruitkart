import { NextRequest, NextResponse } from 'next/server';
import { s3Client, BUCKET_NAME } from '@/lib/storage';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `${uuidv4()}-${file.name.replace(/\s+/g, '_')}`;

        // Upload to S3/MinIO
        await s3Client.send(new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: fileName,
            Body: buffer,
            ContentType: file.type,
        }));

        // Construct URL
        // Note: For MinIO local, it usually looks like http://localhost:9000/bucket/filename
        // For production, it might be different. 
        // We'll use a relative path or a full URL depending on the env setup in lib/storage
        // But here we construct a public URL assuming generic S3 behavior or a proxy.
        // If using MinIO locally with the storage.ts setup:
        const endpoint = process.env.MINIO_ENDPOINT || 'http://localhost:9000';
        const url = `${endpoint}/${BUCKET_NAME}/${fileName}`;

        return NextResponse.json({
            url,
            name: file.name,
            type: file.type,
            size: file.size
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
}
