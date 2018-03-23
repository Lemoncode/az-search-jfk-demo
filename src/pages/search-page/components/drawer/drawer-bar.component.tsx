import * as React from "react";
import Toolbar from "material-ui/Toolbar";
import Icon from "material-ui/Icon";
import IconButton from "material-ui/IconButton";
import Close from "material-ui-icons/Close";
import Typography from "material-ui/Typography";
import { cnc } from "../../../../util";
import { Service } from "../../service";
import { MenuButton } from "../../../../common/components/menu-button";

const style = require("./drawer-bar.style.scss");


interface DrawerBarProps {
  viewMode: "open" | "closed";
  activeService: Service;
  onClose: () => void;
  onMenuClick: () => void;
  className?: string;
}

const DrawerBarOpenContent = ({activeService, onClose}) => (
  <>
    <div className={style.serviceContainer}>
      <Icon classes={{root: style.serviceIcon}} color="primary">
        {activeService.config.serviceIcon}
      </Icon>
      <Typography variant="headline">
        {activeService.config.serviceName}
      </Typography>
    </div>      
    <IconButton aria-label="Close" onClick={onClose}>
      <Close />
    </IconButton>
  </>
);

const DrawerBarClosedContent = ({onMenuClick}) => (
  <MenuButton onClick={onMenuClick}/>
);

const DrawerBarComponent: React.StatelessComponent<DrawerBarProps> = (props) => {
  const containerStyle = props.viewMode === "open" ? style.container : style.containerClosed;
  return (
    <Toolbar 
      classes={{root: cnc(props.className, containerStyle)}}
      disableGutters
    >
      {
        props.viewMode === "open" ?
        <DrawerBarOpenContent
          activeService={props.activeService}
          onClose={props.onClose}
        />
        : <DrawerBarClosedContent onMenuClick={props.onMenuClick}/>
      }
    </Toolbar>
  );
};

export { DrawerBarComponent };