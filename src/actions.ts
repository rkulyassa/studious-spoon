"use server";

import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { UploadedFile } from "@/types";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CF_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function listFiles(): Promise<Array<UploadedFile>> {
  const data = await s3.send(
    new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME,
    })
  );

  if (!data.Contents) return [];

  return data.Contents.map((file) => ({
    key: file.Key!,
    size: file.Size!,
    uploaded: file.LastModified!,
  }));
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
