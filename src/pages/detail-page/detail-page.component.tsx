import * as React from "react";
import { HocrProofreaderComponent } from "../../common/components/hocr/hocr-proofreader";

const style = require("./detail-page.style.scss");


interface DetailPageProps {
  hocr: string;
  targetWords: string[];
}

export class DetailPageComponent extends React.Component<DetailPageProps, {}> {
  constructor(props) {
    super(props);
  }

  public render() {
    return (
      <div className={style.container}>
        <HocrProofreaderComponent
          className={style.mainArea}
          hocr={this.props.hocr}
          targetWords={this.props.targetWords}
          zoomMode="original"
        />
      </div>
    );
  }
}
