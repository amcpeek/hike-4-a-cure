import { useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  InputAdornment,
} from "@mui/material";
import {
  PhotoManager,
  type PhotoManagerHandle,
} from "../../../components/PhotoManager/PhotoManager";
import type { Fundraiser, Photo } from "../../../types";

const fundraiserSchema = z.object({
  year: z
    .number()
    .min(2000, "Year must be 2000 or later")
    .max(2100, "Invalid year"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  amountRaised: z.number().min(0, "Amount must be 0 or greater"),
  photos: z.array(
    z.object({
      url: z.url({ message: "Must be a valid URL" }),
      tag: z.string().optional(),
    }),
  ),
});

type FundraiserFormData = z.infer<typeof fundraiserSchema>;

interface FundraiserFormProps {
  open: boolean;
  fundraiser?: Fundraiser | null;
  onClose: () => void;
  onSubmit: (data: FundraiserFormData) => void;
  isSubmitting: boolean;
}

export function FundraiserForm({
  open,
  fundraiser,
  onClose,
  onSubmit,
  isSubmitting,
}: FundraiserFormProps) {
  const isEditing = !!fundraiser;
  const photoManagerRef = useRef<PhotoManagerHandle>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    getValues,
  } = useForm<FundraiserFormData>({
    resolver: zodResolver(fundraiserSchema),
    defaultValues: {
      year: new Date().getFullYear(),
      title: "",
      description: "",
      amountRaised: 0,
      photos: [],
    },
    values: fundraiser
      ? {
          year: fundraiser.year,
          title: fundraiser.title || "",
          description: fundraiser.description || "",
          amountRaised: fundraiser.amountRaised,
          photos: fundraiser.photos,
        }
      : undefined,
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = handleSubmit(() => {
    if (!photoManagerRef.current?.flushPending()) {
      return;
    }
    onSubmit(getValues());
  });

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleFormSubmit}>
        <DialogTitle>
          {isEditing ? "Edit Fundraiser" : "Add Fundraiser"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Year"
              type="number"
              {...register("year", { valueAsNumber: true })}
              error={!!errors.year}
              helperText={errors.year?.message}
              fullWidth
              autoFocus
            />
            <TextField
              label="Title"
              {...register("title")}
              error={!!errors.title}
              helperText={errors.title?.message}
              fullWidth
            />
            <TextField
              label="Description"
              {...register("description")}
              error={!!errors.description}
              helperText={errors.description?.message}
              fullWidth
              multiline
              rows={4}
            />
            <TextField
              label="Amount Raised"
              type="number"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                },
                htmlInput: { step: "0.01", min: "0" },
              }}
              {...register("amountRaised", { valueAsNumber: true })}
              error={!!errors.amountRaised}
              helperText={errors.amountRaised?.message}
              fullWidth
            />
            <Controller
              name="photos"
              control={control}
              render={({ field }) => (
                <PhotoManager
                  ref={photoManagerRef}
                  photos={field.value as Photo[]}
                  onChange={field.onChange}
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEditing ? "Save" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
