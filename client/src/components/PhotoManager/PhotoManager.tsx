import { useState, forwardRef, useImperativeHandle } from "react";
import {
  Box,
  TextField,
  Button,
  IconButton,
  Card,
  CardMedia,
  Typography,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import type { Photo } from "../../types";

interface PhotoManagerProps {
  photos: Photo[];
  onChange: (photos: Photo[]) => void;
}

export interface PhotoManagerHandle {
  flushPending: () => boolean;
}

export const PhotoManager = forwardRef<PhotoManagerHandle, PhotoManagerProps>(
  function PhotoManager({ photos, onChange }, ref) {
    const [newUrl, setNewUrl] = useState("");
    const [newTag, setNewTag] = useState("");
    const [urlError, setUrlError] = useState("");

    useImperativeHandle(ref, () => ({
      flushPending: () => {
        if (!newUrl.trim()) {
          return true;
        }

        try {
          new URL(newUrl);
        } catch {
          setUrlError("Must be a valid URL");
          return false;
        }

        onChange([
          ...photos,
          { url: newUrl.trim(), tag: newTag.trim() || undefined },
        ]);
        setNewUrl("");
        setNewTag("");
        return true;
      },
    }));

    const handleAdd = () => {
      setUrlError("");

      if (!newUrl.trim()) {
        setUrlError("URL is required");
        return;
      }

      try {
        new URL(newUrl);
      } catch {
        setUrlError("Must be a valid URL");
        return;
      }

      onChange([
        ...photos,
        { url: newUrl.trim(), tag: newTag.trim() || undefined },
      ]);
      setNewUrl("");
      setNewTag("");
    };

    const handleRemove = (index: number) => {
      onChange(photos.filter((_, i) => i !== index));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAdd();
      }
    };

    return (
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Photos
        </Typography>

        {photos.length > 0 && (
          <Stack direction="row" flexWrap="wrap" gap={2} sx={{ mb: 2 }}>
            {photos.map((photo, index) => (
              <Card key={index} sx={{ width: 120, position: "relative" }}>
                <CardMedia
                  component="img"
                  height="80"
                  image={photo.url}
                  alt={photo.tag || `Photo ${index + 1}`}
                  sx={{ objectFit: "cover" }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='80'%3E%3Crect fill='%23ccc' width='120' height='80'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23666'%3EError%3C/text%3E%3C/svg%3E";
                  }}
                />
                <Box sx={{ p: 0.5 }}>
                  <Typography variant="caption" noWrap title={photo.tag}>
                    {photo.tag || "No tag"}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => handleRemove(index)}
                  sx={{
                    position: "absolute",
                    top: 2,
                    right: 2,
                    bgcolor: "rgba(255,255,255,0.8)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.95)" },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Card>
            ))}
          </Stack>
        )}

        <Stack direction="row" gap={1} alignItems="flex-start">
          <TextField
            label="Photo URL"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            error={!!urlError}
            helperText={urlError}
            size="small"
            sx={{ flex: 2 }}
          />
          <TextField
            label="Tag (optional)"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={handleKeyDown}
            size="small"
            sx={{ flex: 1 }}
          />
          <Button
            variant="outlined"
            onClick={handleAdd}
            startIcon={<AddIcon />}
            sx={{ minWidth: 100 }}
          >
            Add
          </Button>
        </Stack>
      </Box>
    );
  },
);
