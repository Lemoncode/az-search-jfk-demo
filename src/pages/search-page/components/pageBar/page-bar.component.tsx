import * as React from "react"
import { ResultViewMode } from "../../view-model";
import { MenuButton } from "../../../../common/components/menu-button";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import IconButton from "material-ui/IconButton";
import SvgIcon from "material-ui-icons/Menu";
import { withStyles, WithStyles } from "material-ui";
import { logoStyle, pageBarStyle } from "./page-bar.style";

const logoSvg = require("../../../../assets/svg/logoJFK.svg");
const style = require("./page-bar.style.scss");


const Logo = (props) => (
  <div className={props.classes.logoContainer}>
    <object className={props.classes.logoObject}
      type="image/svg+xml"
      data={logoSvg}
    />
  </div>
);
const LogoComponent = withStyles(logoStyle)(Logo);

const resultViewModeToggleColor = (props: BarProps) => (viewMode: ResultViewMode) => {
  return props.resultViewMode === viewMode ? "primary" : "inherit";
}

const ResultViewModeToggler = (props: BarProps) => {
  const toggleColor = resultViewModeToggleColor(props);
  return (
    <>
      <IconButton
        classes={{label: style.icon}}
        color={toggleColor("grid")}
        onClick={() => props.onChangeResultViewMode("grid")}
      >
        jfk_grid
      </IconButton>
      <IconButton
        classes={{label: style.icon}}
        color={toggleColor("graph")}
        onClick={() => props.onChangeResultViewMode("graph")}
      >
        jfk_node
      </IconButton>
    </>
  );
}

interface BarProps extends WithStyles {
  resultViewMode: ResultViewMode;
  onChangeResultViewMode: (newMode: ResultViewMode) => void;
  onMenuClick: () => void;
}

const PageBar = (props) => {
  return (
    <AppBar 
      classes={{root: props.classes.appbar}}
      color="inherit"
      position="static"
    >
      <Toolbar classes={{root: props.classes.toolbar}} disableGutters={true}>
        <MenuButton
          className={props.classes.menuButton}
          onClick={props.onMenuClick}
        />
        <LogoComponent />
        <ResultViewModeToggler {...props} />
      </Toolbar>
    </AppBar>
  )
}
export const PageBarComponent = withStyles(pageBarStyle)(PageBar);