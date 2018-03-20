import * as React from "react"
import { Link } from 'react-router-dom';
import { homePath } from "../../../home-page";
import { ResultViewMode } from "../../view-model";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import IconButton from "material-ui/IconButton";
import MenuIcon from "material-ui-icons/Menu";
import HomeIcon from 'material-ui-icons/Home';
import ViewComfyIcon from 'material-ui-icons/ViewComfy';
import DeviceHubIcon from 'material-ui-icons/DeviceHub';

import SvgIcon from "material-ui-icons/Menu";

const logoSvg = require("../../../../assets/svg/azure-search.logo.svg");
const style = require("./page-bar.style.scss");


const MenuButton = ({ onClick }) => (
  <IconButton className={style.toolbarLeft} color="inherit"
    aria-label="Menu" onClick={onClick}
  >
    <MenuIcon />
  </IconButton>
);

const Logo = () => (
  <div className={style.logoContainer}>
    <Typography variant="headline" color="inherit" >Azure</Typography>
    <object className={style.logoIsotype}
      type="image/svg+xml"
      data={logoSvg}
    />
    <Typography variant="headline" color="inherit" >Search</Typography>
  </div>
);

const HomeLink = () => (
  <Link className={style.toolbarLink} to={homePath}>
    <IconButton color="inherit"><HomeIcon/></IconButton>
  </Link>
);

const resultViewModeToggleColor = (props: BarProps) => (viewMode: ResultViewMode) => {
  return props.resultViewMode === viewMode ? "secondary" : "inherit";
}

const ResultViewModeToggler = (props: BarProps) => {
  const toggleColor = resultViewModeToggleColor(props);
  return (
    <div className={style.toolbarRight}>
      <IconButton
        color={toggleColor("grid")}
        onClick={() => props.onChangeResultViewMode("grid")}
      >
        <ViewComfyIcon/>
      </IconButton>
      <IconButton
        color={toggleColor("graph")}
        onClick={() => props.onChangeResultViewMode("graph")}
      >
        <DeviceHubIcon/>
      </IconButton>
      <HomeLink />
    </div>
  );
}

interface BarProps {
  resultViewMode: ResultViewMode;
  onChangeResultViewMode: (newMode: ResultViewMode) => void;
  onMenuClick: () => void;
}

const PageBarComponent: React.StatelessComponent<BarProps> = (props) => {
  return (
    <AppBar position="static">
      <Toolbar classes={{root: style.toolbar}}>
        <MenuButton onClick={props.onMenuClick} />
        <Logo />
        <ResultViewModeToggler {...props} />
      </Toolbar>
    </AppBar>
  )
}

export { PageBarComponent };