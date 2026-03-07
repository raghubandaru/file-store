import { z } from "zod";

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MiB

export const ALLOWED_CONTENT_TYPES = ["image/jpeg", "image/png"] as const;
export type AllowedContentType = (typeof ALLOWED_CONTENT_TYPES)[number];

export const uploadRequestSchema = z.object({
  filename: z.string().min(1, "Filename is required"),
  contentType: z.enum(ALLOWED_CONTENT_TYPES, {
    error: "Only JPEG and PNG files are allowed",
  }),
  size: z.number().max(MAX_FILE_SIZE, "File size must be 5 MB or less"),
});
