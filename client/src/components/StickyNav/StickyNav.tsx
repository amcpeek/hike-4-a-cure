import { List, ListItemButton, ListItemText, Paper } from "@mui/material";

interface NavItem {
  id: string;
  label: string;
}

interface StickyNavProps {
  items: NavItem[];
  activeId: string | null;
  onItemClick: (id: string) => void;
}

export function StickyNav({ items, activeId, onItemClick }: StickyNavProps) {
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
        {items.map((item) => (
          <ListItemButton
            key={item.id}
            selected={activeId === item.id}
            onClick={() => onItemClick(item.id)}
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
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );
}
