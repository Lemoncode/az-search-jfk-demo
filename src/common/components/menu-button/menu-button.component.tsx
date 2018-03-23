import * as React from "react";
import IconButton from "material-ui/IconButton";
import MenuIcon from "material-ui-icons/Menu";

export const MenuButton = ({ onClick, className = "" }) => (
  <IconButton className={className} color="inherit"
    aria-label="Menu" onClick={onClick ? onClick : () => {}}
  >
    <MenuIcon />
  </IconButton>
);