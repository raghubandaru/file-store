import mongoose, { Schema } from "mongoose";

export interface IFile {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  key: string;
  url: string;
  filename: string;
  contentType: string;
  size: number;
  createdAt: Date;
}

const FileSchema = new Schema<IFile>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    key: { type: String, required: true },
    url: { type: String, required: true },
    filename: { type: String, required: true },
    contentType: { type: String, required: true },
    size: { type: Number, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const File =
  (mongoose.models.File as mongoose.Model<IFile>) ||
  mongoose.model<IFile>("File", FileSchema);
