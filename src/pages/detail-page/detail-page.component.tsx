import * as React from "react";
import { Link } from 'react-router-dom';
import { HocrProofreaderComponent } from "../../common/components/hocr-thirdparty";
import { HocrPreviewComponent, HocrDocumentComponent, PageIndex } from "../../common/components/hocr";

const style = require("./detail-page.style.scss");

interface DetailPageProps {
  hocr: string;
  targetWords: string[];
}

interface DetailPageState {
  docIdHighlighted: string;
  previewIdHightlighted: string;
  previewPageIndex: PageIndex;
}

export class DetailPageComponent extends React.Component<DetailPageProps, DetailPageState> {
  constructor(props) {
    super(props);

    this.state = {
      docIdHighlighted: null,
      previewIdHightlighted: null,
      previewPageIndex: "auto",
    }
  }

  private handleDocumentWordHover = (id: string) => {
    this.setState({
      ...this.state,
      previewIdHightlighted: id,
    })
  }

  private handleDocumentPageHover = (index: number) => {
    this.setState({
      ...this.state,
      previewPageIndex: index,
    })
  }

  private handlePreviewWordHover = (id: string) => {
    this.setState({
      ...this.state,
      docIdHighlighted: id,
    })
  }

  public render() {
    return (
      <div className={style.container}>
        {/* <HocrProofreaderComponent
          hocr={this.props.hocr}
          zoom={"original"}
          layout={"both"}
          targetWords={this.props.targetWords}
        /> */}
        <HocrPreviewComponent
          className={style.hocrPreview}
          hocr={this.props.hocr}
          zoomMode="original"
          pageIndex={this.state.previewPageIndex}
          autoFocusId={this.state.previewIdHightlighted}
          targetWords={this.props.targetWords}
          onWordHover={this.handlePreviewWordHover}
        />
        <HocrDocumentComponent
          className={style.hocrDocument}
          hocr={this.props.hocr}
          targetWords={this.props.targetWords}
          autoFocusId={this.state.docIdHighlighted}
          onWordHover={this.handleDocumentWordHover}
          onPageHover={this.handleDocumentPageHover}
        />

      </div>
    );
  }
}
