import { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";
import { Check } from "@mui/icons-material";

interface MenuOption {
  label: string;
  value: string | null;
}

interface ToolbarMenuProps {
  tooltip: string;
  icon: React.ReactNode;
  options: MenuOption[];
  currentValue: string | null;
  onSelect: (value: string | null) => void;
  showColorSwatch?: boolean;
  showSizePreview?: boolean;
}

export function ToolbarMenu({
  tooltip,
  icon,
  options,
  currentValue,
  onSelect,
  showColorSwatch,
  showSizePreview,
}: ToolbarMenuProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  return (
    <>
      <Tooltip title={tooltip}>
        <IconButton
          size="small"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{
            color: showColorSwatch && currentValue ? currentValue : "inherit",
          }}
          color={currentValue && !showColorSwatch ? "primary" : "default"}
        >
          {icon}
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {options.map((option) => (
          <MenuItem
            key={option.label}
            onClick={() => {
              onSelect(option.value);
              setAnchorEl(null);
            }}
          >
            <ListItemIcon>
              {currentValue === option.value && <Check fontSize="small" />}
            </ListItemIcon>

            {showColorSwatch && option.value && (
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  bgcolor: option.value,
                  mr: 1,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              />
            )}

            <ListItemText
              primary={option.label}
              slotProps={
                showSizePreview
                  ? { primary: { sx: { fontSize: option.value || "1rem" } } }
                  : undefined
              }
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
