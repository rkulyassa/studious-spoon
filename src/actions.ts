"use server";

import {
  S3Client,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { UploadedFile } from "@/types";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function listFiles(): Promise<UploadedFile[]> {
  const data = await s3.send(
    new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME,
    })
  );

  const files = data.Contents
    ? data.Contents.map((file) => ({
        key: file.Key!,
        size: file.Size!,
        uploaded: file.LastModified!,
      }))
    : [];

  return files;
}

export async function getPresignedDownloadUrl(objectKey: string) {
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: objectKey,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 60 * 5 });
  return url;
}

export async function uploadFile(formData: FormData) {
  const file = formData.get("file") as File | null;

  if (!file) return { error: "No file uploaded" };

  const fileBuffer = Buffer.from(await file.arrayBuffer());

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: file.name,
      Body: fileBuffer,
      ContentType: file.type,
    })
  );
}

export async function deleteFile(objectKey: string) {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: objectKey,
    })
  );
}
