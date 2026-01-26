import { useState, useRef, useCallback } from "react";
import { Box, Typography, LinearProgress, Alert } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { uploadFile } from "../../api/upload";

interface FileUploadProps {
  onUpload: (url: string) => void;
  accept?: string;
  maxSizeMB?: number;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export function FileUpload({
  onUpload,
  accept = "image/*",
  maxSizeMB = 10,
}: FileUploadProps): React.ReactElement {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return `Invalid file type. Allowed: ${ALLOWED_TYPES.join(", ")}`;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        return `File too large. Maximum size: ${maxSizeMB}MB`;
      }
      return null;
    },
    [maxSizeMB],
  );

  const handleUpload = useCallback(
    async (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setError("");
      setUploading(true);
      setProgress(0);

      try {
        const url = await uploadFile(file, setProgress);
        onUpload(url);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [onUpload, validateFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleUpload(file);
      }
    },
    [handleUpload],
  );

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
    e.target.value = "";
  };

  return (
    <Box>
      <Box
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          border: "2px dashed",
          borderColor: isDragging ? "primary.main" : "grey.400",
          borderRadius: 1,
          p: 3,
          textAlign: "center",
          cursor: uploading ? "default" : "pointer",
          bgcolor: isDragging ? "action.hover" : "transparent",
          transition: "all 0.2s",
          "&:hover": {
            borderColor: uploading ? "grey.400" : "primary.main",
            bgcolor: uploading ? "transparent" : "action.hover",
          },
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          style={{ display: "none" }}
          disabled={uploading}
        />

        {uploading ? (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Uploading... {progress}%
            </Typography>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
        ) : (
          <>
            <CloudUploadIcon
              sx={{ fontSize: 40, color: "text.secondary", mb: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              Drag and drop an image, or click to browse
            </Typography>
            <Typography variant="caption" color="text.disabled">
              Max {maxSizeMB}MB - JPEG, PNG, GIF, WebP
            </Typography>
          </>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 1 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}
    </Box>
  );
}
