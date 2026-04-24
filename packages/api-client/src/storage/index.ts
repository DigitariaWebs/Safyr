import { apiFetch } from "../client";

export interface UploadResponse {
  key: string;
  originalName: string;
  mimeType: string;
  size: number;
}

export interface SignedUrlResponse {
  url: string;
}

export async function uploadFile(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);

  return apiFetch<UploadResponse>("/storage/upload", {
    method: "POST",
    body: formData,
  });
}

export async function getSignedUrl(key: string): Promise<string> {
  const data = await apiFetch<SignedUrlResponse>(`/storage/signed-url/${key}`);
  return data.url;
}
