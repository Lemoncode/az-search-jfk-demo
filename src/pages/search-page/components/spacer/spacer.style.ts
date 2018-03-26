import { Theme } from "material-ui/styles";

export const spacerStyle = (theme: Theme) => ({
  root: {
    flex: "1 1 auto",
    display: "flex",
    flexDirection: "column" as any,
    justifyContent: "flex-start" as any,
    alignItems: "stretch" as any,
    [theme.breakpoints.up("sm")]: {
      margin: "2.5rem",
    },
    [theme.breakpoints.down("xs")]: {
      margin: "1.25rem",
    },
  },
});
