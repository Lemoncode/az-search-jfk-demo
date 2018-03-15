import * as React from "react";
import { 
  PageIndex,
  WordComparator,
  HocrStyleMap,
  parseHocr,
  CreateWordComparator,
  parsePageIndex,
  getNodeId,
  getNodeOptions,
  resolveNodeEntity,  
} from "./hocr-preview.utils";

type ZoomMode = "page-full" | "page-width" | "original";

export interface HocrPreviewStyleMap extends HocrStyleMap {
  page: string;
  background: string;
  image: string;
  placeholders: string;
}

export interface HocrPreviewProps {
  hocr: string;
  pageIndex: PageIndex;
  zoomMode: ZoomMode;
  targetWords?: string[];
  caseSensitiveComparison?: boolean;
  onlyTargetWords?: boolean;
  scrollToNodeId?: string;
  styles?: HocrPreviewStyleMap;
};

export const previewIdSuffix = "preview";
export const activePageId = "hocr-preview-active-page";

export const render = (props: HocrPreviewProps) => {
  if (!props.hocr) return null;

  const doc = parseHocr(props.hocr);
  if (!doc) return null;

  const wordCompare = CreateWordComparator(props.targetWords, props.caseSensitiveComparison);
  
  const parsedPageIndex = parsePageIndex(doc, props.pageIndex, wordCompare);
  if (parsedPageIndex !== null) {
    const pageToRender = doc.body.children[parsedPageIndex];
    return renderPage(pageToRender, props.zoomMode, wordCompare, props.onlyTargetWords, props.styles);
  } else {
    return null;
  }
};

const renderPage = (pageNode: Element, zoomMode: ZoomMode, wordCompare: WordComparator,
  onlyTargetWords: boolean, styleMap: HocrPreviewStyleMap) => {
  if (!pageNode) return null;

  const nodeRenderer = CreateNodeRenderer(pageNode, wordCompare, styleMap);
  const pageOptions = getNodeOptions(pageNode);
  const pageNodes = nodeRenderer.render(onlyTargetWords);
  pageOptions.bbox;
  return (
    <svg
      className={styleMap && styleMap.page}
      id={activePageId}
      viewBox={pageOptions.bbox.join(" ")}
      style={getZoomStyle(zoomMode, pageOptions.bbox)}
    >
      <rect className={styleMap && styleMap.background}
        x="0" y="0" width="100%" height="100%"/>
      <image className={styleMap && styleMap.image}
        x="0" y="0" width="100%" height="100%"
        xlinkHref={pageOptions.image}/>
      <g className={styleMap && styleMap.placeholders}>
        {pageNodes}
      </g>
    </svg>
  );  
};

const getZoomStyle = (zoomMode: ZoomMode, bbox: any) => {
  return {
    width: (zoomMode === "original") ? `${(bbox[2]-bbox[0])}px` : "",
    height: (zoomMode === "original") ? `${(bbox[3]-bbox[1])}px` : "",
    maxWidth: (zoomMode !== "original") ? "100%" : "",
    maxHeight: (zoomMode === "page-full") ? "100%" : "",
  }
}

const CreateNodeRenderer = (rootNode: Element, wordCompare: WordComparator, styleMap: HocrStyleMap) => {

  const render = (onlyTargetWords: boolean) => {
    return onlyTargetWords ? renderOnlyTargets(rootNode) : renderAll(rootNode);
  };

  const renderAll = (node: Element) => {
    return Array.from(node.children).map((child, index) => {
      const {entity, className} = getNodeInfo(child);
      if (entity === "word") {
        const isTarget = wordCompare && wordCompare(child.textContent);
        return renderSvgRect(child, isTarget ? `${className} ${getStyle("highlight")}` : className, index);
      } else if (entity && child.children && child.children.length) {
        return renderSvgGroup(child, className, index);
      } else {
        return null;
      }
    })
    .filter(n => n);
  };

  const renderOnlyTargets = (node: Element) => {
    if (!wordCompare) return null; 

    return Array.from(node.children).map((child, index) => {
      const {entity, className} = getNodeInfo(child);
      if (entity === "word" && wordCompare(child.textContent)) {
        return renderSvgRect(child, `${className} ${getStyle("highlight")}`, index);
      } else if (child.children && child.children.length) {
        return renderOnlyTargets(child);
      } else {
        return null;
      }
    })
    .filter(n => n);
  };

  const renderSvgRect = (node: Element, className: string, index: number) => {
    const id = getNodeId(node, previewIdSuffix);
    const nodeOptions = getNodeOptions(node);
    return (nodeOptions && nodeOptions.bbox) ? 
    (
      <rect
        className={className}
        key={index}
        id={id}
        x={nodeOptions.bbox[0]}
        y={nodeOptions.bbox[1]}
        width={nodeOptions.bbox[2] - nodeOptions.bbox[0]}
        height={nodeOptions.bbox[3] - nodeOptions.bbox[1]}
      />
    ) : null;
  };
  
  const renderSvgGroup = (node: Element, className: string, index: number) => {
    return (
      <g className={className} key={index}>
        {renderSvgRect(node, className, index)}
        {renderAll(node)}
      </g>
    );
  };

  const getNodeInfo = (node: Element) => {
    const entity = resolveNodeEntity(node);
    const className = getStyle(entity);

    return {
      entity,
      className,
    };
  }

  const getStyle = (entity: string) => {
    return styleMap ? styleMap[entity] : null;
  }

  return {
    render,
  };
};
