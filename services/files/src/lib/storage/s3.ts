import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuid } from "uuid";
import s3 from "../s3";
import type { StorageAdapter } from "../storage";

export function createS3Adapter(): StorageAdapter {
  const bucket = process.env.AWS_S3_BUCKET!;
  const region = process.env.AWS_REGION!;

  return {
    async getUploadUrl(userId, filename, contentType) {
      const key = `${userId}/${uuid()}-${filename}`;
      const uploadUrl = await getSignedUrl(
        s3,
        new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType }),
        { expiresIn: 60 }
      );
      const fileUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
      return { uploadUrl, fileUrl, key };
    },

    async getReadUrl(key) {
      return getSignedUrl(s3, new GetObjectCommand({ Bucket: bucket, Key: key }), {
        expiresIn: 3600,
      });
    },

    async deleteObject(key) {
      await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
    },

    async deleteObjects(keys) {
      if (keys.length === 0) return;
      await s3.send(
        new DeleteObjectsCommand({
          Bucket: bucket,
          Delete: { Objects: keys.map((Key) => ({ Key })) },
        })
      );
    },
  };
}
