import * as React from "react"
import { Link } from 'react-router-dom';
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import MenuIcon from "material-ui-icons/Menu";
import HomeIcon from 'material-ui-icons/Home';
import IconButton from "material-ui/IconButton";
import SvgIcon from "material-ui-icons/Menu";

const logoSvg = require("../../../../assets/svg/azure-search.logo.svg");
const style = require("./page-bar.style.scss");

interface Bar {
  value: string;
  onMenuClick: () => void;
}

const LogoComponent = () => (
  <div className={style.logoContainer}>
    <Typography variant="headline" color="inherit" >Azure</Typography>
    <object className={style.logoIsotype}
      type="image/svg+xml"
      data={logoSvg}
    />
    <Typography variant="headline" color="inherit" >Search</Typography>
  </div>
);

const PageBarComponent: React.StatelessComponent<Bar> = (props) => {
  return (
    <AppBar position="static">
      <Toolbar classes={{root: style.toolbar}}>
        <IconButton className={style.toolbarMenuButton} color="inherit"
          aria-label="Menu" onClick={props.onMenuClick}
        >
          <MenuIcon />
        </IconButton>
        <LogoComponent />
        <Link to="/">
          <IconButton color="inherit"><HomeIcon/></IconButton>
        </Link>
      </Toolbar>
    </AppBar>
  )
}

export { PageBarComponent };