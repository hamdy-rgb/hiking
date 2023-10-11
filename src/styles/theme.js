import { createTheme } from "@mui/material/styles";
import { frFR } from "@mui/material/locale";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ff0000",
    },
    secondary: {
      main: "#3A9BA4",
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    button: {
      textTransform: "capitalize",
    },
  },
  frFR,
});

export default theme;
