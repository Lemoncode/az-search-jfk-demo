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
      pageIndex: "auto",
      targetWords: this.props.targetWords,
      caseSensitiveComparison: false,
      onlyTargetWords: true,
      styles: {
        area: style.area,
        paragraph: style.par,
        line: style.line,
        word: style.word,
        highlight: style.highlight,
        page: style.page,
        background: style.background,
        image: style.image,
        placeholders: style.placeholders,
      }
    };

    return (
      <div className={style.container}>
        {render(config)}
      </div>
    );
  }
};
