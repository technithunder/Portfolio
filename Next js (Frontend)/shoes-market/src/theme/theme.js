import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    white: {
      main: "#fff",
    },
    black: {
      main: "#000",
    },
    grey: {
      main: "#F6F6F6",
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: true,
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          padding: "7px 16px",
          textTransform: "none",
          "&:hover": {
            background: "none",
          },
          "&:focus": {
            outline: "none",
          },
        },
      },
    },
  },
});
