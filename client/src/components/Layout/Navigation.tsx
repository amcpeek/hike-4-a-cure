import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { SignedIn, UserButton } from "@clerk/clerk-react";

const publicNavItems = [
  { label: "Home", path: "/" },
  { label: "Fundraisers", path: "/fundraisers" },
];

const adminNavItems = [
  { label: "Admin: Sections", path: "/admin/sections" },
  { label: "Admin: Fundraisers", path: "/admin/fundraisers" },
];

export function Navigation() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: "none",
              color: "inherit",
              fontWeight: 600,
            }}
          >
            Hike For A Cure
          </Typography>

          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open menu"
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              {publicNavItems.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  color="inherit"
                  sx={{
                    borderBottom: isActive(item.path)
                      ? "2px solid white"
                      : "none",
                    borderRadius: 0,
                  }}
                >
                  {item.label}
                </Button>
              ))}
              <SignedIn>
                {adminNavItems.map((item) => (
                  <Button
                    key={item.path}
                    component={Link}
                    to={item.path}
                    color="inherit"
                    sx={{
                      borderBottom: isActive(item.path)
                        ? "2px solid white"
                        : "none",
                      borderRadius: 0,
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
                <UserButton />
              </SignedIn>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 250 }} role="navigation">
          <List>
            {publicNavItems.map((item) => (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={isActive(item.path)}
                  onClick={() => setDrawerOpen(false)}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
            <SignedIn>
              {adminNavItems.map((item) => (
                <ListItem key={item.path} disablePadding>
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    selected={isActive(item.path)}
                    onClick={() => setDrawerOpen(false)}
                  >
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              ))}
              <ListItem>
                <UserButton />
              </ListItem>
            </SignedIn>
          </List>
        </Box>
      </Drawer>
    </>
  );
}
