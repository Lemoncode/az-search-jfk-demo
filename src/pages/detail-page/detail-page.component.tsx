import * as React from "react";
import { HocrProofreaderComponent } from "../../common/components/hocr";
import { ZoomMode } from "../../common/components/hocr";
import { ToolbarComponent } from "./components/toolbar";

const style = require("./detail-page.style.scss");


interface DetailPageProps {
  hocr: string;
  targetWords: string[];
  zoomMode?: ZoomMode;
  showText?: boolean;
  onToggleTextClick: () => void;
  onZoomChange: (zoomMode: ZoomMode) => void;
  onCloseClick: () => void;
}

export class DetailPageComponent extends React.Component<DetailPageProps, {}> {
  constructor(props) {
    super(props);
  }

  public render() {
    return (
      <div className={style.container}>
        <ToolbarComponent
          onToggleTextClick={this.props.onToggleTextClick}
          onZoomChange={this.props.onZoomChange}
          onCloseClick={this.props.onCloseClick}
        />
        <HocrProofreaderComponent
          className={style.mainArea}
          hocr={this.props.hocr}
          targetWords={this.props.targetWords}
          zoomMode={this.props.zoomMode}
          showText={this.props.showText}
        />
      </div>
    );
  }
}
