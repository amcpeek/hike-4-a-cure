import { forwardRef } from "react";
import { Box, Divider, Typography } from "@mui/material";
import { PhotoGallery } from "../../components/PhotoGallery/PhotoGallery";
import type { Section } from "../../types";

interface SectionContentProps {
  section: Section;
}

export const SectionContent = forwardRef<HTMLDivElement, SectionContentProps>(
  function SectionContent({ section }, ref) {
    return (
      <Box
        ref={ref}
        id={`section-${section._id}`}
        sx={{ scrollMarginTop: "80px", mb: 4 }}
      >
        <Typography variant="h4" component="h2" gutterBottom>
          {section.title}
        </Typography>

        {section.description && (
          <Typography
            component="div"
            sx={{ color: "text.secondary", mb: 2 }}
            dangerouslySetInnerHTML={{ __html: section.description }}
          />
        )}

        <PhotoGallery photos={section.photos} />

        <Divider sx={{ mt: 4 }} />
      </Box>
    );
  },
);
