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
import AddIcon from "@mui/icons-material/Add";
import { toast } from "sonner";
import {
  fetchFundraisers,
  createFundraiser,
  updateFundraiser,
  deleteFundraiser,
} from "../../../api/fundraisers";
import { FundraiserForm } from "./FundraiserForm";
import { ConfirmDialog } from "../../../components/ConfirmDialog/ConfirmDialog";
import type { Fundraiser, FundraiserInput } from "../../../types";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function FundraisersAdmin() {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editingFundraiser, setEditingFundraiser] = useState<Fundraiser | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<Fundraiser | null>(null);

  const {
    data: fundraisers = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["fundraisers"],
    queryFn: fetchFundraisers,
  });

  const createMutation = useMutation({
    mutationFn: createFundraiser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fundraisers"] });
      toast.success("Fundraiser created");
      setFormOpen(false);
    },
    onError: () => {
      toast.error("Failed to create fundraiser");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<FundraiserInput>;
    }) => updateFundraiser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fundraisers"] });
      toast.success("Fundraiser updated");
      setEditingFundraiser(null);
    },
    onError: () => {
      toast.error("Failed to update fundraiser");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFundraiser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fundraisers"] });
      toast.success("Fundraiser deleted");
      setDeleteTarget(null);
    },
    onError: () => {
      toast.error("Failed to delete fundraiser");
    },
  });

  const sortedFundraisers = [...fundraisers].sort((a, b) => b.year - a.year);

  const handleFormSubmit = (data: FundraiserInput) => {
    if (editingFundraiser) {
      updateMutation.mutate({ id: editingFundraiser._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (fundraiser: Fundraiser) => {
    setEditingFundraiser(fundraiser);
  };

  const handleAdd = () => {
    setEditingFundraiser(null);
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
        Failed to load fundraisers
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
        <Typography variant="h4">Fundraisers</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          Add Fundraiser
        </Button>
      </Box>

      {sortedFundraisers.length === 0 ? (
        <Alert severity="info">
          No fundraisers yet. Create your first one!
        </Alert>
      ) : (
        <Stack spacing={2}>
          {sortedFundraisers.map((fundraiser) => (
            <Card key={fundraiser._id}>
              <CardContent
                sx={{ display: "flex", alignItems: "center", gap: 2 }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6">
                    {fundraiser.year}
                    {fundraiser.title && ` - ${fundraiser.title}`}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatCurrency(fundraiser.amountRaised)} raised •{" "}
                    {fundraiser.photos.length} photo
                    {fundraiser.photos.length !== 1 && "s"}
                  </Typography>
                </Box>

                <IconButton
                  onClick={() => handleEdit(fundraiser)}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => setDeleteTarget(fundraiser)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      <FundraiserForm
        open={formOpen || !!editingFundraiser}
        fundraiser={editingFundraiser}
        onClose={() => {
          setFormOpen(false);
          setEditingFundraiser(null);
        }}
        onSubmit={handleFormSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Fundraiser"
        message={`Are you sure you want to delete the ${deleteTarget?.year} fundraiser? This action cannot be undone.`}
        onConfirm={() =>
          deleteTarget && deleteMutation.mutate(deleteTarget._id)
        }
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteMutation.isPending}
      />
    </Box>
  );
}
