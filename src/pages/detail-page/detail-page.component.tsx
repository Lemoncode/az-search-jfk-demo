import * as React from "react";
import { Link } from 'react-router-dom';
import { HocrProofreaderComponent } from "../../common/components/hocr-thirdparty";
import { HocrPreviewComponent } from "../../common/components/hocr";

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
      <div>
        <HocrProofreaderComponent
          hocr={this.props.hocr}
          zoom={"original"}
          layout={"both"}
          targetWords={this.props.targetWords}
        />
        <HocrPreviewComponent
          hocr={this.props.hocr}
          pageIndex="auto"
          zoomMode="original"
          targetWords={this.props.targetWords}
        />
      </div>
    );
  }
}
