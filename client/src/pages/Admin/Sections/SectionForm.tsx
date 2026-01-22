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
} from "@mui/material";
import { PhotoManager } from "../../../components/PhotoManager/PhotoManager";
import type { Section, Photo } from "../../../types";

const sectionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  order: z.number().min(0, "Order must be 0 or greater"),
  photos: z.array(
    z.object({
      url: z.url({ message: "Must be a valid URL" }),
      tag: z.string().optional(),
    }),
  ),
});

type SectionFormData = z.infer<typeof sectionSchema>;

interface SectionFormProps {
  open: boolean;
  section?: Section | null;
  nextOrder: number;
  onClose: () => void;
  onSubmit: (data: SectionFormData) => void;
  isSubmitting: boolean;
}

export function SectionForm({
  open,
  section,
  nextOrder,
  onClose,
  onSubmit,
  isSubmitting,
}: SectionFormProps) {
  const isEditing = !!section;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<SectionFormData>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      title: "",
      description: "",
      order: nextOrder,
      photos: [],
    },
    values: section
      ? {
          title: section.title,
          description: section.description || "",
          order: section.order,
          photos: section.photos,
        }
      : undefined,
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{isEditing ? "Edit Section" : "Add Section"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              {...register("title")}
              error={!!errors.title}
              helperText={errors.title?.message}
              fullWidth
              autoFocus
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
              label="Order"
              type="number"
              {...register("order", { valueAsNumber: true })}
              error={!!errors.order}
              helperText={errors.order?.message}
              fullWidth
            />
            <Controller
              name="photos"
              control={control}
              render={({ field }) => (
                <PhotoManager
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
