import { S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_RES!,
    secretAccessKey: process.env.AWS_SECRET_KEY_RES!,
  },
});

export default s3;
