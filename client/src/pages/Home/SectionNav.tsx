import { List, ListItemButton, ListItemText, Paper } from "@mui/material";
import type { Section } from "../../types";

interface SectionNavProps {
  sections: Section[];
  activeId: string | null;
  onSectionClick: (sectionId: string) => void;
}

export function SectionNav({
  sections,
  activeId,
  onSectionClick,
}: SectionNavProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        position: "sticky",
        top: 80,
        p: 2,
        bgcolor: "grey.50",
        borderRadius: 2,
      }}
    >
      <List disablePadding>
        {sections.map((section) => (
          <ListItemButton
            key={section._id}
            selected={activeId === section._id}
            onClick={() => onSectionClick(section._id)}
            sx={{
              borderRadius: 1,
              mb: 0.5,
              "&.Mui-selected": {
                bgcolor: "primary.main",
                color: "white",
                "&:hover": {
                  bgcolor: "primary.dark",
                },
              },
            }}
          >
            <ListItemText primary={section.title} />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );
}
