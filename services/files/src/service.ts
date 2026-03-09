import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuid } from "uuid";
import s3 from "./lib/s3";
import {
  deleteFileById,
  deleteFilesByUserId,
  findFileById,
  findFileKeysByUserId,
  findFiles,
  insertFile,
} from "./repository";

export async function getFiles(userId: string) {
  const files = await findFiles(userId);
  return Promise.all(
    files.map(async (file) => {
      const url = await getSignedUrl(
        s3,
        new GetObjectCommand({ Bucket: process.env.AWS_S3_BUCKET, Key: file.key }),
        { expiresIn: 3600 }
      );
      return { ...file, url };
    })
  );
}

export async function getUploadUrl(userId: string, filename: string, contentType: string) {
  const key = `${userId}/${uuid()}-${filename}`;
  const uploadUrl = await getSignedUrl(
    s3,
    new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      ContentType: contentType,
    }),
    { expiresIn: 60 }
  );
  const fileUrl = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  return { uploadUrl, fileUrl, key };
}

export async function deleteFile(userId: string, fileId: string) {
  const file = await findFileById(fileId, userId);

  if (!file) throw new Error("File not found");

  await s3.send(new DeleteObjectCommand({ Bucket: process.env.AWS_S3_BUCKET, Key: file.key }));

  await deleteFileById(fileId);
}

export async function deleteUserFiles(userId: string) {
  const keys = await findFileKeysByUserId(userId);

  if (keys.length > 0) {
    await s3.send(
      new DeleteObjectsCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Delete: { Objects: keys.map((Key) => ({ Key })) },
      })
    );
  }

  await deleteFilesByUserId(userId);
}

export async function saveFile(
  userId: string,
  data: {
    key: string;
    fileUrl: string;
    filename: string;
    contentType: string;
    size: number;
  }
) {
  try {
    return await insertFile({
      userId,
      key: data.key,
      url: data.fileUrl,
      filename: data.filename,
      contentType: data.contentType,
      size: data.size,
    });
  } catch (err) {
    // DB save failed — remove the already-uploaded S3 object to avoid orphaned files
    try {
      await s3.send(new DeleteObjectCommand({ Bucket: process.env.AWS_S3_BUCKET, Key: data.key }));
    } catch (s3Err) {
      console.error("[files-service] Failed to clean up orphaned S3 object:", data.key, s3Err);
    }
    throw err;
  }
}
