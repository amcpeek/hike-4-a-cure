import { forwardRef } from "react";
import { Box, Divider, Typography } from "@mui/material";
import DOMPurify from "dompurify";
import { PhotoGallery } from "../../components/PhotoGallery/PhotoGallery";
import type { Fundraiser } from "../../types";

interface FundraiserCardProps {
  fundraiser: Fundraiser;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export const FundraiserCard = forwardRef<HTMLDivElement, FundraiserCardProps>(
  function FundraiserCard({ fundraiser }, ref) {
    return (
      <Box
        ref={ref}
        id={`fundraiser-${fundraiser._id}`}
        sx={{ scrollMarginTop: "80px", mb: 4 }}
      >
        <Typography variant="h4" component="h2" gutterBottom>
          {fundraiser.year}
        </Typography>

        <Typography variant="h6" color="text.secondary" gutterBottom>
          {fundraiser.title}
        </Typography>

        <Typography variant="subtitle1" color="primary" sx={{ mb: 2 }}>
          {formatCurrency(fundraiser.amountRaised)} raised
        </Typography>

        {fundraiser.description && (
          <Typography
            component="div"
            className="rich-content"
            sx={{ color: "text.secondary", mb: 2 }}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(fundraiser.description),
            }}
          />
        )}

        <PhotoGallery photos={fundraiser.photos} />

        <Divider sx={{ mt: 4 }} />
      </Box>
    );
  },
);
