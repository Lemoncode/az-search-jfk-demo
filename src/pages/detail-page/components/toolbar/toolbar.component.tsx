import * as React from "react";
import { Link } from "react-router-dom";
import { ZoomMode } from "../../../../common/components/hocr";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Typography from "material-ui/Typography";
import IconButton from "material-ui/IconButton";
import CloseIcon from "material-ui-icons/Close";
import ZoomOutMapIcon from "material-ui-icons/ZoomOutMap";
import ImportExportIcon from "material-ui-icons/ImportExport";
import SwapHorizIcon from "material-ui-icons/SwapHoriz";
import FormatAlignCenterIcon from "material-ui-icons/FormatAlignCenter";

const style = require("./toolbar.style.scss");


/**
 * Main toolbar for Detail page.
 */

interface ToolbarProps {
  onToggleTextClick: () => void;
  onZoomChange: (zoomMode: ZoomMode) => void;
  onCloseClick: () => void;
}

export class ToolbarComponent extends React.Component<ToolbarProps, {}> {
  constructor(props) {
    super(props);
  }

  private handleZoomClick = (zoomMode: ZoomMode) => () => {
    this.props.onZoomChange(zoomMode);
  }

  public render() {
    return (
      <Toolbar classes={{ root: style.toolbar }}>
        <div className={style.toolbarGroup}>
          <ToggleTextButton onClick={this.props.onToggleTextClick} />
          <VerticalSeparator />
          <OriginalSizeButton onClick={this.handleZoomClick("original")} />
          <PageWidthButton onClick={this.handleZoomClick("page-width")} />
          <PageFullButton onClick={this.handleZoomClick("page-full")} />
        </div>
        <div className={style.toolbarGroup}>
          <CloseButton onClick={this.props.onCloseClick} />
        </div>
      </Toolbar>
    );
  }
}

const ToggleTextButton = ({ onClick }) => (
  <IconButton color="inherit" onClick={onClick}>
    <FormatAlignCenterIcon />
  </IconButton>
);

const OriginalSizeButton = ({ onClick }) => (
  <IconButton color="inherit" onClick={onClick}>
    <ZoomOutMapIcon />
  </IconButton>
);

const PageWidthButton = ({ onClick }) => (
  <IconButton color="inherit" onClick={onClick}>
    <SwapHorizIcon />
  </IconButton>
);

const PageFullButton = ({ onClick }) => (
  <IconButton color="inherit" onClick={onClick}>
    <ImportExportIcon />
  </IconButton>
);

const CloseButton = ({ onClick }) => (
  <IconButton color="inherit" onClick={onClick}>
    <CloseIcon />
  </IconButton>
);

const VerticalSeparator = () => <div className={style.verticalSeparator}/>
