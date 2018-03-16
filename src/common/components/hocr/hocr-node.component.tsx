import * as React from "react";
import { 
  WordComparator,
  HocrStyleMap,
  getNodeId,
  getNodeOptions,
  resolveNodeEntity,  
} from "./hocr-utils";

const style = require("./hocr-node.style.scss");


interface HocrNodeProps {
  rootNode: Element;
  wordCompare: WordComparator;
  idSuffix: string;
  onlyTargetWords?: boolean;
  styleMap?: HocrStyleMap;
}

export const defaultNodeStyles: HocrStyleMap = {
  area: style.area,
  paragraph: style.par,
  line: style.line,
  word: style.word,
  highlight: style.highlight,  
}

const mergeNodeStyle = (inputStyles: HocrStyleMap) => {
  return {
    ...defaultNodeStyles,
    ...inputStyles,
  };
}

export const HocrNodeComponent: React.StatelessComponent<HocrNodeProps> = (props) => {
  if (!props.rootNode) return null;
  
  const mStyleMap = mergeNodeStyle(props.styleMap);
  const nodeRenderer = CreateNodeRenderer(props.rootNode, props.wordCompare, mStyleMap, props.idSuffix);
  
  return props.onlyTargetWords ? 
    nodeRenderer.renderOnlyTargets(props.rootNode) :
    nodeRenderer.renderAll(props.rootNode);
}

const CreateNodeRenderer = (rootNode: Element, wordCompare: WordComparator, styleMap: HocrStyleMap, idSuffix: string) => {

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
    const id = getNodeId(node, idSuffix);
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
    renderAll,
    renderOnlyTargets,
  };
};
