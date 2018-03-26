import * as React from "react";
import { withStyles, Theme } from "material-ui/styles";
import Divider from "material-ui/Divider";

const horizontalSeparatorStyle = (theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    opacity: 0.35,
    [theme.breakpoints.up("sm")]: {
      margin: "0 2.5rem",
    },
  },
});

const HorizontalSeparator = (props) => {
  const { classes } = props;
  return (
    <Divider classes={{root: classes.root}}/>
  );
}

export const HorizontalSeparatorComponent = withStyles(horizontalSeparatorStyle)(HorizontalSeparator);
