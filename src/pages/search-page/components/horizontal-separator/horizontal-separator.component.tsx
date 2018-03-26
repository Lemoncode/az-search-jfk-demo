import * as React from "react";
import Divider from "material-ui/Divider";

const style = require("./horizontal-separator.style.scss");

export const HorizontalSeparatorComponent = (props) => (
  <Divider classes={{root: style.separator}}/>
);

