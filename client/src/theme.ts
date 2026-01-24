import { createTheme } from "@mui/material/styles";

// Brand colors - use these throughout the app
export const brandColors = {
  maroon: "#9d2235",
  darkGray: "#555555",
  black: "#000000",
} as const;

// Font sizes for rich text editor
export const fontSizes = {
  small: "0.875rem",
  normal: "1rem",
  large: "1.25rem",
  extraLarge: "1.5rem",
} as const;

export const theme = createTheme({
  palette: {
    primary: {
      main: brandColors.maroon,
    },
    secondary: {
      main: brandColors.darkGray,
    },
    text: {
      primary: brandColors.black,
      secondary: brandColors.darkGray,
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 600,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});
