import { createMuiTheme } from 'material-ui/styles';
import blue from 'material-ui/colors/blue';
import pink from 'material-ui/colors/pink';import { dark } from 'material-ui/styles/createPalette';
;

const theme = createMuiTheme({
  palette: {
    common: {
      black: "#eeeeee",
      white: "#ffffff",
    },
    primary: blue,
    secondary: pink,
    background: {
      default: "#eeeeee",
      paper: "#ffffff",
    }
  },
  transitions: {
    duration: {
      shortest: 100,
      shorter: 125,
      short: 150,
      standard:200,
      complex: 225,
    }
  }
});

export { theme };