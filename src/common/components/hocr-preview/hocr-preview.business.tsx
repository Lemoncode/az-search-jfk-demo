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


export interface HocrPreviewStyleMap extends HocrStyleMap {
  page: string;
  background: string;
  image: string;
  placeholders: string;
}

export interface HocrPreviewConfig {
  hocr: string;
  pageIndex: PageIndex;
  targetWords?: string[];
  caseSensitiveComparison?: boolean;
  onlyTargetWords?: boolean;
  styles?: HocrPreviewStyleMap;
};

export const render = (config: HocrPreviewConfig) => {
  if (!config.hocr) return null;

  const doc = parseHocr(config.hocr);
  if (!doc) return null;

  const wordCompare = CreateWordComparator(config.targetWords, config.caseSensitiveComparison);
  
  const parsedPageIndex = parsePageIndex(doc, config.pageIndex, wordCompare);
  if (parsedPageIndex !== null) {
    const pageToRender = doc.body.children[parsedPageIndex];
    return renderPage(pageToRender, wordCompare, config.onlyTargetWords, config.styles);
  } else {
    return null;
  }
};

const renderPage = (pageNode: Element, wordCompare: WordComparator, onlyTargetWords: boolean, 
  styleMap: HocrPreviewStyleMap) => {
  if (!pageNode) return null;

  const nodeRenderer = CreateNodeRenderer(pageNode, wordCompare, styleMap);
  const pageOptions = getNodeOptions(pageNode);
  const pageNodes = nodeRenderer.render(onlyTargetWords);
  
  return (
    <svg
      className={styleMap && styleMap.page}
      viewBox={pageOptions.bbox.join(" ")}
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
    const id = getNodeId(node, "preview");
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
