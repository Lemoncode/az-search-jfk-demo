import * as React from "react";
import { 
  HocrStyleMap,
  getNodeId,
  getNodeOptions,
  WordComparator,
} from "./hocr-utils";
import { HocrNodeComponent, defaultNodeStyles } from "./hocr-node.component";

const style = require("./hocr-page.style.scss");


export type ZoomMode = "page-full" | "page-width" | "original";

export interface HocrPageStyleMap extends HocrStyleMap {
  page: string;
  background: string;
  image: string;
  placeholders: string;
}

const defaultPageStyles: HocrPageStyleMap = {
  page: style.page,
  background: style.background,
  image: style.image,
  placeholders: style.placeholders,
  ...defaultNodeStyles,
}

const mergePageStyle = (inputStyles: HocrPageStyleMap) => {
  return {
    ...defaultPageStyles,
    ...inputStyles,
  };
}

interface HocrPageProps {
  pageNode: Element;
  wordCompare: WordComparator;
  idSuffix: string;
  zoomMode?: ZoomMode;
  onlyTargetWords?: boolean;
  styleMap?: HocrPageStyleMap;
  onWordHover?: (wordId: string) => void;
}

export const HocrPageComponent: React.StatelessComponent<HocrPageProps> = (props) => {
  if (!props.pageNode) return null;
  const mStyleMap = mergePageStyle(props.styleMap);
  const pageOptions = getNodeOptions(props.pageNode);

  return (
    <svg
      className={mStyleMap && mStyleMap.page}
      id={getNodeId(props.pageNode, props.idSuffix)}
      viewBox={pageOptions.bbox.join(" ")}
      style={getZoomStyle(props.zoomMode || "original", pageOptions.bbox)}
    >
      <rect className={mStyleMap && mStyleMap.background}
        x="0" y="0" width="100%" height="100%"/>
      <image className={mStyleMap && mStyleMap.image}
        x="0" y="0" width="100%" height="100%"
        xlinkHref={pageOptions.image}/>
      <g className={mStyleMap && mStyleMap.placeholders}>
        <HocrNodeComponent
          rootNode={props.pageNode}
          wordCompare={props.wordCompare}
          idSuffix={props.idSuffix}
          onlyTargetWords={props.onlyTargetWords}
          styleMap={props.styleMap}
          onWordHover={props.onWordHover}
        />
      </g>
    </svg>
  );
}

const getZoomStyle = (zoomMode: ZoomMode, bbox: any) => {
  return {
    width: (zoomMode === "original") ? `${(bbox[2]-bbox[0])}px` : "",
    height: (zoomMode === "original") ? `${(bbox[3]-bbox[1])}px` : "",
    maxWidth: (zoomMode !== "original") ? "100%" : "",
    maxHeight: (zoomMode === "page-full") ? "100%" : "",
  }
}
