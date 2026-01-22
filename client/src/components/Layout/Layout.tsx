import { Outlet } from "react-router-dom";
import { Box, Container } from "@mui/material";
import { Toaster } from "sonner";
import { Navigation } from "./Navigation";

export function Layout() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navigation />
      <Container component="main" sx={{ flex: 1, py: 3 }}>
        <Outlet />
      </Container>
      <Toaster position="bottom-right" richColors />
    </Box>
  );
}
