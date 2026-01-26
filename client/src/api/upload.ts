import { post } from "./client";

interface PresignResponse {
  uploadUrl: string;
  fileUrl: string;
  key: string;
}

interface PresignRequest {
  filename: string;
  contentType: string;
  fileSize: number;
}

export function getPresignedUrl(
  request: PresignRequest,
): Promise<PresignResponse> {
  return post<PresignResponse>("/upload/presign", request);
}

export async function uploadFile(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<string> {
  const { uploadUrl, fileUrl } = await getPresignedUrl({
    filename: file.name,
    contentType: file.type,
    fileSize: file.size,
  });

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(fileUrl);
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });

    xhr.addEventListener("error", () => {
      reject(new Error("Upload failed"));
    });

    xhr.open("PUT", uploadUrl);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.send(file);
  });
}
