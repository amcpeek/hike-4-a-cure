import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
import { fetchSections } from "../../api/sections";
import { SectionNav } from "./SectionNav";
import { SectionContent } from "./SectionContent";

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const isScrollingRef = useRef(false);

  const {
    data: sections,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sections"],
    queryFn: fetchSections,
  });

  const scrollToSection = useCallback(
    (sectionId: string) => {
      const element = sectionRefs.current.get(sectionId);
      const section = sections?.find((s) => s._id === sectionId);
      if (element && section) {
        isScrollingRef.current = true;
        setActiveId(sectionId);
        element.scrollIntoView({ behavior: "smooth" });
        window.history.replaceState(null, "", `#${toSlug(section.title)}`);
        setDrawerOpen(false);

        setTimeout(() => {
          isScrollingRef.current = false;
        }, 1000);
      }
    },
    [sections],
  );

  // Handle initial hash navigation
  useEffect(() => {
    if (!sections?.length) return;

    const hash = location.hash.slice(1);
    if (hash) {
      const matchingSection = sections.find((s) => toSlug(s.title) === hash);
      if (matchingSection) {
        setTimeout(() => scrollToSection(matchingSection._id), 100);
      }
    } else {
      setActiveId(sections[0]._id);
    }
  }, [sections, location.hash, scrollToSection]);

  // Intersection Observer for active section tracking
  useEffect(() => {
    if (!sections?.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id.replace("section-", "");
            const section = sections.find((s) => s._id === sectionId);
            setActiveId(sectionId);
            if (section) {
              window.history.replaceState(
                null,
                "",
                `#${toSlug(section.title)}`,
              );
            }
          }
        });
      },
      {
        rootMargin: "-100px 0px -60% 0px",
        threshold: 0,
      },
    );

    sectionRefs.current.forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  const setSectionRef = useCallback(
    (id: string) => (el: HTMLDivElement | null) => {
      if (el) {
        sectionRefs.current.set(id, el);
      } else {
        sectionRefs.current.delete(id);
      }
    },
    [],
  );

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
        <Alert severity="error">Failed to load sections</Alert>
      </Container>
    );
  }

  if (!sections?.length) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography color="text.secondary">No sections yet</Typography>
      </Container>
    );
  }

  const activeIndex = sections.findIndex((s) => s._id === activeId);

  return (
    <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
      {/* Mobile: Horizontal tabs */}
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
              onChange={(_, index) => scrollToSection(sections[index]._id)}
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
              {sections.map((section) => (
                <Tab key={section._id} label={section.title} />
              ))}
            </Tabs>
          </Box>

          {/* Floating menu button for drawer on mobile */}
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
                <Typography variant="h6">Sections</Typography>
                <IconButton onClick={() => setDrawerOpen(false)}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <List>
                {sections.map((section) => (
                  <ListItemButton
                    key={section._id}
                    selected={activeId === section._id}
                    onClick={() => scrollToSection(section._id)}
                  >
                    <ListItemText primary={section.title} />
                  </ListItemButton>
                ))}
              </List>
            </Box>
          </Drawer>

          {/* Mobile content */}
          <Box sx={{ mt: 2 }}>
            {sections.map((section) => (
              <SectionContent
                key={section._id}
                ref={setSectionRef(section._id)}
                section={section}
              />
            ))}
          </Box>
        </>
      )}

      {/* Desktop: Two-column layout */}
      {!isMobile && (
        <Box sx={{ display: "flex", gap: 4 }}>
          <Box sx={{ width: 240, flexShrink: 0 }}>
            <SectionNav
              sections={sections}
              activeId={activeId}
              onSectionClick={scrollToSection}
            />
          </Box>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            {sections.map((section) => (
              <SectionContent
                key={section._id}
                ref={setSectionRef(section._id)}
                section={section}
              />
            ))}
          </Box>
        </Box>
      )}
    </Container>
  );
}
