import { useState, type ReactNode } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Drawer,
  Fab,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Tabs,
  Tab,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import type { UseQueryResult } from "@tanstack/react-query";
import { useScrollSpy } from "../../hooks/useScrollSpy";
import { StickyNav } from "../StickyNav/StickyNav";

interface WithId {
  _id: string;
}

interface ScrollablePageLayoutProps<T extends WithId> {
  query: UseQueryResult<T[], Error>;
  itemName: string;
  getLabel: (item: T) => string;
  getHash?: (item: T) => string;
  renderItem: (item: T, ref: (el: HTMLDivElement | null) => void) => ReactNode;
}

export function ScrollablePageLayout<T extends WithId>({
  query,
  itemName,
  getLabel,
  getHash,
  renderItem,
}: ScrollablePageLayoutProps<T>) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data: items, isLoading, error } = query;

  const { activeId, setItemRef, scrollToItem } = useScrollSpy<T>({
    items,
    getLabel,
    getHash,
  });

  const handleScrollToItem = (itemId: string) => {
    scrollToItem(itemId);
    setDrawerOpen(false);
  };

  const capitalizedName = itemName.charAt(0).toUpperCase() + itemName.slice(1);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">Failed to load {itemName}</Alert>
      </Container>
    );
  }

  if (!items?.length) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography color="text.secondary">No {itemName} yet</Typography>
      </Container>
    );
  }

  const activeIndex = items.findIndex((item) => item._id === activeId);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
      {isMobile && (
        <>
          <Box
            sx={{
              position: "sticky",
              top: 64,
              zIndex: 10,
              bgcolor: "background.paper",
              borderBottom: 1,
              borderColor: "divider",
              mx: -3,
              px: 1,
            }}
          >
            <Tabs
              value={activeIndex >= 0 ? activeIndex : 0}
              onChange={(_, index) => handleScrollToItem(items[index]._id)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  minWidth: "auto",
                  px: 2,
                },
              }}
            >
              {items.map((item) => (
                <Tab key={item._id} label={getLabel(item)} />
              ))}
            </Tabs>
          </Box>

          <Fab
            color="primary"
            size="small"
            onClick={() => setDrawerOpen(true)}
            sx={{
              position: "fixed",
              bottom: 16,
              right: 16,
              display: { md: "none" },
            }}
          >
            <MenuIcon />
          </Fab>

          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
          >
            <Box sx={{ width: 280, p: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h6">{capitalizedName}</Typography>
                <IconButton onClick={() => setDrawerOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <List>
                {items.map((item) => (
                  <ListItemButton
                    key={item._id}
                    selected={activeId === item._id}
                    onClick={() => handleScrollToItem(item._id)}
                  >
                    <ListItemText primary={getLabel(item)} />
                  </ListItemButton>
                ))}
              </List>
            </Box>
          </Drawer>

          <Box sx={{ mt: 2 }}>
            {items.map((item) => renderItem(item, setItemRef(item._id)))}
          </Box>
        </>
      )}

      {!isMobile && (
        <Box sx={{ display: "flex", gap: 4 }}>
          <Box sx={{ width: 240, flexShrink: 0 }}>
            <StickyNav
              items={items.map((item) => ({
                id: item._id,
                label: getLabel(item),
              }))}
              activeId={activeId}
              onItemClick={handleScrollToItem}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            {items.map((item) => renderItem(item, setItemRef(item._id)))}
          </Box>
        </Box>
      )}
    </Container>
  );
}
