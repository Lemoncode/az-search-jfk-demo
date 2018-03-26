import { Theme } from "material-ui/styles";

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
