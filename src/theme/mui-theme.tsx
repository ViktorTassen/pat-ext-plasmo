import { createTheme } from "@mui/material/styles"

// Create a custom theme
export const theme = createTheme({
  palette: {
    primary: {
      main: "#3b82f6", // Blue color
    },
    secondary: {
      main: "#9ca3af", // Gray color
    }
  },
  components: {
    MuiCheckbox: {
      defaultProps: {
        disableRipple: true, // Disable ripple effect to reduce DOM elements
      },
      styleOverrides: {
        root: {
          padding: "4px",
          zIndex: 100,
          position: "relative",
          "&:hover": {
            backgroundColor: "rgba(59, 130, 246, 0.04)",
          },
        }
      }
    }
  }
})