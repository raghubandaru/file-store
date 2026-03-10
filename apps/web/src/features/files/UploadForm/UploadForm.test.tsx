import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { UploadForm } from "./UploadForm";
import { MAX_FILE_SIZE } from "@file-store/schemas/upload";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

class MockFileReader {
  onload: ((e: ProgressEvent<FileReader>) => void) | null = null;
  result = "data:image/jpeg;base64,mockdata";

  readAsDataURL(_file: File) {
    if (this.onload) {
      this.onload({ target: this } as unknown as ProgressEvent<FileReader>);
    }
  }
}

function makeFile(name: string, type: string, size: number): File {
  const file = new File(["x".repeat(size)], name, { type });
  Object.defineProperty(file, "size", { value: size });
  return file;
}

function getFileInput(container: HTMLElement) {
  return container.querySelector('input[type="file"]') as HTMLInputElement;
}

function selectFile(container: HTMLElement, file: File) {
  const input = getFileInput(container);
  Object.defineProperty(input, "files", { value: [file], configurable: true });
  fireEvent.change(input, { target: { files: [file] } });
}

describe("Upload workflow", () => {
  beforeEach(() => {
    vi.stubGlobal("FileReader", MockFileReader);
    vi.stubGlobal("fetch", vi.fn());
    mockPush.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the dropzone in idle state", () => {
    const { container } = render(<UploadForm />);
    expect(screen.getByText(/drag and drop or click here/i)).toBeInTheDocument();
    expect(getFileInput(container)).toBeInTheDocument();
  });

  it("does not show upload / clear buttons before a file is selected", () => {
    render(<UploadForm />);
    expect(screen.queryByRole("button", { name: /upload/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /clear/i })).not.toBeInTheDocument();
  });

  it("shows an error for a disallowed file type", () => {
    const { container } = render(<UploadForm />);
    selectFile(container, makeFile("photo.gif", "image/gif", 100));
    expect(screen.getByText("Only JPEG and PNG files are allowed.")).toBeInTheDocument();
  });

  it("shows an error when the file exceeds the maximum size", () => {
    const { container } = render(<UploadForm />);
    selectFile(container, makeFile("big.jpg", "image/jpeg", MAX_FILE_SIZE + 1));
    expect(screen.getByText("File size must be 5 MB or less.")).toBeInTheDocument();
  });

  it("shows file name and action buttons after a valid file is selected", () => {
    const { container } = render(<UploadForm />);
    selectFile(container, makeFile("photo.jpg", "image/jpeg", 1024));
    expect(screen.getByText("photo.jpg")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /upload/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /clear/i })).toBeInTheDocument();
  });

  it("returns to idle state when Clear is clicked", () => {
    const { container } = render(<UploadForm />);
    selectFile(container, makeFile("photo.jpg", "image/jpeg", 1024));
    fireEvent.click(screen.getByRole("button", { name: /clear/i }));
    expect(screen.getByText(/drag and drop or click here/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /upload/i })).not.toBeInTheDocument();
  });

  it("calls the three upload APIs in order and navigates on success", async () => {
    const mockFetch = vi
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          uploadUrl: "https://s3.example.com/presigned",
          fileUrl: "https://cdn.example.com/photo.jpg",
          key: "uploads/photo.jpg",
        }),
      })
      .mockResolvedValueOnce({ ok: true })
      .mockResolvedValueOnce({ ok: true });

    vi.stubGlobal("fetch", mockFetch);

    const { container } = render(<UploadForm />);
    selectFile(container, makeFile("photo.jpg", "image/jpeg", 1024));
    fireEvent.click(screen.getByRole("button", { name: /upload/i }));

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/file/list"));

    // 1st call: upload-url
    expect(mockFetch.mock.calls[0][0]).toBe("/api/upload-url");
    expect(mockFetch.mock.calls[0][1]).toMatchObject({ method: "POST" });

    // 2nd call: S3 presigned URL
    expect(mockFetch.mock.calls[1][0]).toBe("https://s3.example.com/presigned");
    expect(mockFetch.mock.calls[1][1]).toMatchObject({ method: "PUT" });

    // 3rd call: save-file
    expect(mockFetch.mock.calls[2][0]).toBe("/api/save-file");
    expect(mockFetch.mock.calls[2][1]).toMatchObject({ method: "POST" });
  });

  it("shows uploading state while the upload is in progress", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise(() => {}))
    );

    const { container } = render(<UploadForm />);
    selectFile(container, makeFile("photo.jpg", "image/jpeg", 1024));
    fireEvent.click(screen.getByRole("button", { name: /upload/i }));

    expect(await screen.findByRole("status")).toHaveTextContent("Uploading…");
  });

  it("shows an error when the upload-url request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Unauthorized" }),
      })
    );

    const { container } = render(<UploadForm />);
    selectFile(container, makeFile("photo.jpg", "image/jpeg", 1024));
    fireEvent.click(screen.getByRole("button", { name: /upload/i }));

    expect(await screen.findByText("Unauthorized")).toBeInTheDocument();
  });

  it("shows an error when the S3 upload fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            uploadUrl: "https://s3.example.com/presigned",
            fileUrl: "https://cdn.example.com/photo.jpg",
            key: "uploads/photo.jpg",
          }),
        })
        .mockResolvedValueOnce({ ok: false })
    );

    const { container } = render(<UploadForm />);
    selectFile(container, makeFile("photo.jpg", "image/jpeg", 1024));
    fireEvent.click(screen.getByRole("button", { name: /upload/i }));

    expect(
      await screen.findByText("Upload to storage failed. Please try again.")
    ).toBeInTheDocument();
  });
});
