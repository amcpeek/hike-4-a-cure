import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Typography,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "sonner";
import {
  fetchSections,
  createSection,
  updateSection,
  deleteSection,
  reorderSections,
} from "../../../api/sections";
import { SectionForm } from "./SectionForm";
import { ConfirmDialog } from "../../../components/ConfirmDialog/ConfirmDialog";
import type { Section, SectionInput } from "../../../types";

export function SectionsAdmin() {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Section | null>(null);

  const {
    data: sections = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sections"],
    queryFn: fetchSections,
  });

  const createMutation = useMutation({
    mutationFn: createSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      toast.success("Section created");
      setFormOpen(false);
    },
    onError: () => {
      toast.error("Failed to create section");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SectionInput> }) =>
      updateSection(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      toast.success("Section updated");
      setEditingSection(null);
    },
    onError: () => {
      toast.error("Failed to update section");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      toast.success("Section deleted");
      setDeleteTarget(null);
    },
    onError: () => {
      toast.error("Failed to delete section");
    },
  });

  const reorderMutation = useMutation({
    mutationFn: reorderSections,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
    },
    onError: () => {
      toast.error("Failed to reorder sections");
    },
  });

  const sortedSections = [...sections].sort((a, b) => a.order - b.order);
  const nextOrder =
    sections.length > 0 ? Math.max(...sections.map((s) => s.order)) + 1 : 0;

  const handleFormSubmit = (data: SectionInput) => {
    if (editingSection) {
      updateMutation.mutate({ id: editingSection._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sortedSections.length) return;

    const newOrder = [...sortedSections];
    [newOrder[index], newOrder[newIndex]] = [
      newOrder[newIndex],
      newOrder[index],
    ];
    reorderMutation.mutate(newOrder.map((s) => s._id));
  };

  const handleEdit = (section: Section) => {
    setEditingSection(section);
  };

  const handleAdd = () => {
    setEditingSection(null);
    setFormOpen(true);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        Failed to load sections
      </Alert>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Sections</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          Add Section
        </Button>
      </Box>

      {sortedSections.length === 0 ? (
        <Alert severity="info">No sections yet. Create your first one!</Alert>
      ) : (
        <Stack spacing={2}>
          {sortedSections.map((section, index) => (
            <Card key={section._id}>
              <CardContent
                sx={{ display: "flex", alignItems: "center", gap: 2 }}
              >
                <Stack>
                  <IconButton
                    size="small"
                    onClick={() => handleMove(index, "up")}
                    disabled={index === 0 || reorderMutation.isPending}
                  >
                    <ArrowUpwardIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleMove(index, "down")}
                    disabled={
                      index === sortedSections.length - 1 ||
                      reorderMutation.isPending
                    }
                  >
                    <ArrowDownwardIcon fontSize="small" />
                  </IconButton>
                </Stack>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6">{section.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Order: {section.order} • {section.photos.length} photo
                    {section.photos.length !== 1 && "s"}
                  </Typography>
                </Box>

                <IconButton onClick={() => handleEdit(section)}>
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => setDeleteTarget(section)}
                  color="primary"
                >
                  <DeleteIcon />
                </IconButton>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      <SectionForm
        open={formOpen || !!editingSection}
        section={editingSection}
        nextOrder={nextOrder}
        onClose={() => {
          setFormOpen(false);
          setEditingSection(null);
        }}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Section"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        onConfirm={() =>
          deleteTarget && deleteMutation.mutate(deleteTarget._id)
        }
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteMutation.isPending}
      />
    </Box>
  );
}
