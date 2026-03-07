export type ActionState = {
  errors?: Record<string, string>;
};

export interface UserProfile {
  id: string;
  name: string;
  email: string;
}

export interface FileItem {
  id: string;
  filename: string;
  contentType: string;
  size: number;
  // ISO 8601 date string
  createdAt: string;
  url: string;
}
