import type { Metadata } from "next";
import type { FileItem } from "@file-store/design-system";
import { FileList } from "@file-store/design-system";

export const metadata: Metadata = { title: "My Files" };

const MOCK_FILES: FileItem[] = [
  {
    id: "1",
    filename: "mountain-landscape.jpg",
    size: 2_340_000,
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    uploadedAt: "2026-02-18T10:24:00Z",
  },
  {
    id: "2",
    filename: "city-skyline.jpg",
    size: 1_870_000,
    url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800",
    uploadedAt: "2026-02-20T14:05:00Z",
  },
  {
    id: "3",
    filename: "forest-path.jpg",
    size: 980_000,
    url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800",
    uploadedAt: "2026-02-25T09:11:00Z",
  },
  {
    id: "4",
    filename: "ocean-waves.jpg",
    size: 3_120_000,
    url: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800",
    uploadedAt: "2026-03-01T16:47:00Z",
  },
];

export default function FilesPage() {
  return (
    <>
      <h1>My Files</h1>
      <FileList files={MOCK_FILES} />
    </>
  );
}
