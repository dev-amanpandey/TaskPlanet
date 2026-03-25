import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#f4f5f8",
      paper: "#ffffff",
    },
    primary: {
      main: "#2E6BFF",
    },
    text: {
      primary: "#1f2430",
      secondary: "#6b7280",
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: `"Segoe UI", system-ui, -apple-system, sans-serif`,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid rgba(15, 23, 42, 0.08)",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
        },
      },
    },
  },
});

