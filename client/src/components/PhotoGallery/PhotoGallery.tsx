import { Box, ImageList, ImageListItem, ImageListItemBar } from "@mui/material";
import type { Photo } from "../../types";

interface PhotoGalleryProps {
  photos: Photo[];
}

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  if (photos.length === 0) return null;

  return (
    <Box sx={{ mt: 2 }}>
      <ImageList
        sx={{
          gridTemplateColumns: {
            xs: "repeat(2, 1fr) !important",
            sm: "repeat(3, 1fr) !important",
            md: "repeat(4, 1fr) !important",
          },
          gap: "12px !important",
        }}
      >
        {photos.map((photo, index) => (
          <ImageListItem
            key={`${photo.url}-${index}`}
            sx={{
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            <img
              src={photo.url}
              alt={photo.tag || `Photo ${index + 1}`}
              loading="lazy"
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
              }}
            />
            {photo.tag && (
              <ImageListItemBar
                title={photo.tag}
                sx={{
                  "& .MuiImageListItemBar-title": {
                    fontSize: "0.875rem",
                  },
                }}
              />
            )}
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
}
