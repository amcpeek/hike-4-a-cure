import { forwardRef } from "react";
import { Box, Divider, Typography } from "@mui/material";
import DOMPurify from "dompurify";
import { PhotoGallery } from "../../components/PhotoGallery/PhotoGallery";
import type { Section } from "../../types";

interface SectionCardProps {
  section: Section;
}

export const SectionCard = forwardRef<HTMLDivElement, SectionCardProps>(
  function SectionCard({ section }, ref) {
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
            className="rich-content"
            sx={{ color: "text.secondary", mb: 2 }}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(section.description),
            }}
          />
        )}

        <PhotoGallery photos={section.photos} />

        <Divider sx={{ mt: 4 }} />
      </Box>
    );
  },
);
