import { createMuiTheme } from 'material-ui/styles';

const defs = require("./main.scss");


export const theme = createMuiTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 768,
      md: 1024,
      lg: 1280,
      xl: 1920,
    },
  },
  palette: {
    common: {
      black: defs.colorBlack,
      white: defs.colorWhite,
    },
    primary: {
      main: defs.colorPrimary,
    },
    secondary: {
      main: defs.colorSecondary,
    },
    background: {
      default: defs.colorBackground,
      paper: defs.colorPaper,
    },
  },
  transitions: {
    duration: {
      shortest: 100,
      shorter: 125,
      short: 150,
      standard:200,
      complex: 225,
    }
  },
  typography: {
    fontFamily: '"Open Sans", sans-serif',
    fontSize: "1rem",
    fontWeightRegular: 300,
  }
});
