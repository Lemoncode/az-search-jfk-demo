import * as React from "react";

const style = require("./hocr-preview.style.scss");


export interface HocrPreviewConfig {
  hocr: string;
  pageIndex: number;
  targetWords?: string[];
  onlyTargetWords?: boolean;
}

export const render = (config: HocrPreviewConfig) => {
  if (!config.hocr) return null;

  const domParser = new DOMParser();
  const doc = domParser.parseFromString(config.hocr, "text/html");
  
  if (!doc || config.pageIndex < 0 ||
    !checkPageIndexInRange(doc, config.pageIndex)) return null;

  return renderPage(doc.body.children[config.pageIndex],
    config.targetWords, config.onlyTargetWords);
};

const checkPageIndexInRange = (doc: Document, pageIndex: number) => {
  return doc.body && doc.body.children && (pageIndex < doc.body.children.length);
}

const renderPage = (pageNode: Element, targetWords: string[], onlyTargetWords: boolean) => {
  if (!pageNode) return null;

  const targetWordsLowerCase = targetWords.map(w => w.toLowerCase());
  const nodeRenderer = CreateNodeRenderer(pageNode, targetWordsLowerCase);
  const pageOptions = getNodeOptions(pageNode);

  return (
    <svg
      className={style.hocrPreviewPage}
      viewBox={pageOptions.bbox.join(" ")}
    >
      <rect className={style.hocrPreviewBackground}
        x="0" y="0" width="100%" height="100%"/>
      <image className={style.hocrPreviewImage}
        x="0" y="0" width="100%" height="100%"
        xlinkHref={pageOptions.image}/>
      <g className={style.hocrPreviewPlaceholders}>
        {nodeRenderer.render(onlyTargetWords)}
      </g>
    </svg>
  );  
}



const CreateNodeRenderer = (rootNode: Element, targetWords: string[]) => {

  const render = (onlyTargetWords: boolean) => {
    return onlyTargetWords ? renderOnlyTargets(rootNode) : renderAll(rootNode);
  };

  const renderAll = (node: Element) => {
    return Array.from(node.children).map(child => {
      const className = getNodeClassName(child);
      if (className === "ocrx_word") {
        const targetNode = isTarget(child.textContent);
        return renderSvgRect(child, targetNode ? `${className} highlight` : className);
      } else if (className && child.children && child.children.length) {
        return renderSvgGroup(child, className);
      } else {
        return null;
      }
    }).filter(n => n).join("");
  };

  const renderOnlyTargets = (node: Element) => {
    return Array.from(node.children).map(child => {
      const className = getNodeClassName(child);
      if (className === "ocrx_word" && isTarget(child.textContent)) {
        return renderSvgRect(child, `${className} highlight`);
      } else if (child.children && child.children.length) {
        return renderOnlyTargets(child);
      } else {
        return null;
      }
    }).filter(n => n).join("");
  };

  const renderSvgRect = (node: Element, className: string) => {
    const id = getNodeId(node);
    const nodeOptions = getNodeOptions(node);
    return (
      <rect
        className={className}
        id={id}
        x={nodeOptions.bbox[0]}
        y={nodeOptions.bbox[1]}
        width={nodeOptions.bbox[2] - nodeOptions.bbox[0]}
        height={nodeOptions.bbox[3] - nodeOptions.bbox[1]}
      />
    );
  }
  
  const renderSvgGroup = (node: Element, className: string) => {
    const id = getNodeId(node);
    return (
      <g className={className} id={id}>
        {renderAll(node)}
      </g>
    );
  }

  const isTarget = isTargetWord(targetWords);

  return {
    render,
  };
};

const supportedClassNames = ["ocr_area", "ocr_par", "ocr_line", "ocrx_word"];

const getNodeClassName = (node: Element): string => {
  supportedClassNames.forEach(className => {
    if (node.classList.contains(className)) return className;
  });

  return null;
};

const getNodeId = (node: Element): string => {
  const id = node.getAttribute("id");
  return id ? `${id}-preview` : "";
}

const optionArrayFields = ['bbox', 'baseline', 'scan_res'];

const getNodeOptions = (node: Element): any => {
  const optionsStr = node["title"] ? node["title"] : "";
  const regex = /(?:^|;)\s*(\w+)\s+(?:([^;"']+?)|"((?:\\"|[^"])+?)"|'((?:\\'|[^'])+?)')\s*(?=;|$)/g;
  let match;
  
  let options = {};
  while (match = regex.exec(optionsStr)) {
      const name = match[1];
      let value = match[4] || match[3] || match[2];
      if (optionArrayFields.indexOf(name) !== -1) {
          value = value.split(/\s+/);
      }
      options[name] = value;
  }
  return options;
};

const isTargetWord = (targetWords: string[]) => (word: string): boolean => {
  return targetWords.indexOf(word.toLowerCase()) >= 0;  
}
