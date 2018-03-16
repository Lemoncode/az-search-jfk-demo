import * as React from "react";
import { 
  WordComparator,
  HocrStyleMap,
  getNodeId,
  getNodeOptions,
  resolveNodeEntity,
  composeId,  
} from "./hocr-utils";

const style = require("./hocr-node.style.scss");


interface HocrNodeProps {
  rootNode: Element;
  wordCompare: WordComparator;
  idSuffix: string;
  onlyTargetWords?: boolean;
  styleMap?: HocrStyleMap;
  onWordHover?: (wordId: string) => void;
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
  const nodeRenderer = CreateNodeRenderer(props.rootNode, props.wordCompare, mStyleMap,
    props.idSuffix, props.onWordHover);
  
  return props.onlyTargetWords ? 
    nodeRenderer.renderOnlyTargets(props.rootNode) :
    nodeRenderer.renderAll(props.rootNode);
}

const CreateNodeRenderer = (rootNode: Element, wordCompare: WordComparator,
  styleMap: HocrStyleMap, idSuffix: string, onWordHover: (wordId: string) => void) => {

  const renderAll = (node: Element) => {
    return Array.from(node.children).map((child, index) => {
      const {entity, className} = getNodeInfo(child);
      if (entity === "word") {
        const isTarget = wordCompare && wordCompare(child.textContent);
        const composedClassName = isTarget ? `${className} ${getStyle("highlight")}` : className;
        return renderSvgRect(child, composedClassName, index, onWordHover);
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
        const composedClassName = `${className} ${getStyle("highlight")}`;
        return renderSvgRect(child, composedClassName, index, onWordHover);
      } else if (child.children && child.children.length) {
        return renderOnlyTargets(child);
      } else {
        return null;
      }
    })
    .filter(n => n);
  };

  const renderSvgRect = (node: Element, className: string, index: number, onHover?) => {
    const id = getNodeId(node);
    const suffixedId = composeId(id, idSuffix);
    const nodeOptions = getNodeOptions(node);
    return (nodeOptions && nodeOptions.bbox) ? 
    (
      <rect
        className={className}
        key={index}
        id={suffixedId}
        x={nodeOptions.bbox[0]}
        y={nodeOptions.bbox[1]}
        width={nodeOptions.bbox[2] - nodeOptions.bbox[0]}
        height={nodeOptions.bbox[3] - nodeOptions.bbox[1]}
        onMouseEnter={onHover ? () => onHover(id) : () => {}}
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
