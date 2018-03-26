import * as React from "react";
import { withStyles } from "material-ui/styles";
import { spacerStyle } from "./spacer.style";

const Spacer = (props) => {
  const { classes } = props;
  return (
    <div className={classes.root}>
      {props.children}
    </div>
  );
}

export const SpacerComponent = withStyles(spacerStyle)(Spacer);
