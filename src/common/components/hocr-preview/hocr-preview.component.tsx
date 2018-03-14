import * as React from "react";
import { render, HocrPreviewConfig } from "./hocr-preview.business";

const style = require("./hocr-preview.style.scss");


/**
 * HOCR-Preview
 */

interface HocrPreviewProps {
  hocr: string;
  targetWords: string[];
}

export class HocrPreviewComponent extends React.Component<HocrPreviewProps, {}> {
  constructor(props) {
    super(props);
  }

  public componentDidMount() {

  }

  public shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  public render() {
    const config: HocrPreviewConfig = {
      hocr: this.props.hocr,
      targetWords: this.props.targetWords,
      pageIndex: 0,
      onlyTargetWords: false,     
    };

    return (
      <div className={style.container}>
        {render(config)}
      </div>
    );
  }
};
