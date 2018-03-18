import * as React from "react";
import { getNodeId, getNodeOptions } from "./hocr-common.util";
import { HocrNodeProps, HocrNodeComponent, getNodeChildrenComponents } from "./hocr-node.component";
import { injectDefaultPageStyle } from "./hocr-page.style";
import { HocrPreviewStyleMap } from "./hocr-common.style";


/**
 * HOCR Page
 */

export type ZoomMode = "page-full" | "page-width" | "original";

interface HocrPageProps extends HocrNodeProps {
  zoomMode?: ZoomMode;
}

export class HocrPageComponent extends React.Component<HocrPageProps, {}> {
  constructor(props) {
    super(props);
  }
  
  public shouldComponentUpdate(nextProps: HocrPageProps) {
    return (
      this.props.node !== nextProps.node ||
      this.props.wordCompare !== nextProps.wordCompare ||
      this.props.idSuffix !== nextProps.idSuffix ||
      this.props.renderOnlyTargetWords !== nextProps.renderOnlyTargetWords ||
      this.props.userStyle !== nextProps.userStyle ||
      this.props.onWordHover !== nextProps.onWordHover
    );
  }

  public render() {
    if (!this.props.node) return null;
    const safeStyle = injectDefaultPageStyle(this.props.userStyle);
    const pageOptions = getNodeOptions(this.props.node);

    return (
      <svg
        className={safeStyle.page}
        id={getNodeId(this.props.node, this.props.idSuffix)}
        viewBox={pageOptions.bbox.join(" ")}
        style={getZoomStyle(this.props.zoomMode || "original", pageOptions.bbox)}
      >
        <rect className={safeStyle.background}
          x="0" y="0" width="100%" height="100%"/>
        <image className={safeStyle.image}
          x="0" y="0" width="100%" height="100%"
          xlinkHref={pageOptions.image}/>
        <g className={safeStyle.placeholders}>
          {getNodeChildrenComponents(this.props)}
        </g>
      </svg>
    );
  }
}

const getZoomStyle = (zoomMode: ZoomMode, bbox: any) => {
  return {
    width: (zoomMode === "original") ? `${(bbox[2]-bbox[0])}px` : "",
    height: (zoomMode === "original") ? `${(bbox[3]-bbox[1])}px` : "",
    maxWidth: (zoomMode !== "original") ? "100%" : "",
    maxHeight: (zoomMode === "page-full") ? "100%" : "",
  }
}
