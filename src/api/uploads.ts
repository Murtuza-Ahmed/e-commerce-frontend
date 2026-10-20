/**
 * Uploads API — `/api/uploads` (Cloudinary).
 */
import { api, uploadFile } from "@/lib/api-client";
import type { UploadResult } from "@/types";

export async function uploadImage(file: File, folder?: string): Promise<UploadResult> {
  const form = new FormData();
  form.append("file", file);
  if (folder) form.append("folder", folder);
  return uploadFile<UploadResult>("/uploads", form);
}

export async function deleteUpload(publicId: string): Promise<void> {
  await api.delete<void>(`/uploads?publicId=${encodeURIComponent(publicId)}`);
}
