import { Theme } from "material-ui/styles";

export const itemStyle = (theme: Theme) => ({
  card: {
    width: "16rem",
    margin: "0 0.75rem 1.5rem",
    [theme.breakpoints.up("sm")]: {
      width: "19rem",
      margin: "0 1rem 2.5rem",
    },
  },
  media: {
    objectFit: "cover",
    objectPosition: "center",
    cursor: "pointer",
    height: "22rem",
    [theme.breakpoints.up("sm")]: {
      height: "26rem",
    },
  },
  actions: {
    display: "flex",
    flexDirection: "row" as any,
    justifyContent: "space-between" as any,
    alignItems: "center" as any,
    backgroundColor: theme.palette.grey["300"],
  },
  rating: {
    display: "flex",
    flexDirection: "row" as any,
    justifyContent: "flex-start" as any,
    alignItems: "center" as any,
  },
  chevron: {
    margin: "0 0 0 auto",
  }
});
