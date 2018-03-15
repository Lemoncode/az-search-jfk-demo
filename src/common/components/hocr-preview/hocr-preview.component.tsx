import * as React from "react";
import { calculateNodeShiftInContainer, composeIdSuffix } from "./hocr-preview.utils";
import {
  render,
  HocrPreviewProps,
  HocrPreviewStyleMap,
  activePageId,
  previewIdSuffix
} from "./hocr-preview.business";

const style = require("./hocr-preview.style.scss");

const defaultStyles: HocrPreviewStyleMap = {
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

const mergeStyles = (inputStyles: HocrPreviewStyleMap) => {
  return {
    ...defaultStyles,
    ...inputStyles,
  };
}

/**
 * HOCR-Preview
 */

export class HocrPreviewComponent extends React.Component<HocrPreviewProps, {}> {
  constructor(props) {
    super(props);
  }

  private containerRef = null;

  private saveContainerRef = (node) => {
    this.containerRef = node;
  }

  private scrollToNodeId = (nodeId: string) => {
    if (this.containerRef && nodeId) {
      // Calculate scroll shift to reveal node right in the
      // center of the container.
      const targetId = composeIdSuffix(nodeId, previewIdSuffix);
      const {x, y} = calculateNodeShiftInContainer(targetId, activePageId);
      const scrollLeft = this.containerRef.scrollWidth * x - (this.containerRef.clientWidth / 2); 
      const scrollTop = this.containerRef.scrollHeight * y - (this.containerRef.clientHeight / 2);
      this.containerRef.scrollTo({left: scrollLeft, top: scrollTop});
    }
  }

  public componentDidMount() {
    if (this.props.scrollToNodeId) {
      this.scrollToNodeId(this.props.scrollToNodeId);
    }    
  }

  public shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  public render() {
    const mergedProps = {
      ...this.props,
      styles: mergeStyles(this.props.styles),
    };

    return (
      <div className={style.container} ref={this.saveContainerRef}>
        {render(mergedProps)}
      </div>
    );
  }
};
