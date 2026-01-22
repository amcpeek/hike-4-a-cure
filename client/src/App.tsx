import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { SectionsAdmin } from "./pages/Admin/Sections/SectionsAdmin";
import { Typography, Box } from "@mui/material";

function PlaceholderPage({ title }: { title: string }) {
  return (
    <Box sx={{ textAlign: "center", py: 8 }}>
      <Typography variant="h2" gutterBottom>
        {title}
      </Typography>
      <Typography color="text.secondary">Coming in a future phase</Typography>
    </Box>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<PlaceholderPage title="Home" />} />
        <Route
          path="fundraisers"
          element={<PlaceholderPage title="Fundraisers" />}
        />
        <Route path="admin/sections" element={<SectionsAdmin />} />
        <Route
          path="admin/fundraisers"
          element={<PlaceholderPage title="Admin: Fundraisers" />}
        />
      </Route>
    </Routes>
  );
}
