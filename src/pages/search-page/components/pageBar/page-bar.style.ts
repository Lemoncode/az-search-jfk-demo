import { Theme } from "material-ui/styles";

export const logoStyle = (theme: Theme) => ({
  logoContainer: {
    flex: "1 1 auto",
    display: "flex",
    flexDirection: "row" as any,
    justifyContent: "center" as any,
    alignItems: "center" as any,
    marginLeft: "3rem",
    [theme.breakpoints.up("sm")]: {
      marginLeft: "6rem",
    },
  },
  logoObject: {
    flex: "1 1 auto",
    margin: "0 0.5rem",
    maxHeight: "2.5rem",
    [theme.breakpoints.up("sm")]: {
      maxHeight: "4.5rem",
    },
  },
});

export const pageBarStyle = (theme: Theme) => ({
  appbar: {
    boxShadow: "none",
  },
  toolbar: {
    display: "flex",
    flexDirection: "row" as any,
    justifyContent: "flex-start" as any,
    alignItems: "center" as any,
    height: "3rem",
    margin: "0.75rem",
    [theme.breakpoints.up("sm")]: {
      height: "7.8rem",
      margin: "0 1.75rem",
    },
  },
  menuButton: {
    [theme.breakpoints.up("sm")]: {
      display: "none",
    }
  },
});
