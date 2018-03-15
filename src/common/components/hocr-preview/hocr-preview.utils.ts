export type PageIndex = number | "auto";
export type WordComparator = (word: string) => boolean;

export interface HocrStyleMap {
  area: string;
  paragraph: string;
  line: string;
  word: string;
  highlight: string;
};

export const hocrEntityMap = {
  area: "ocr_carea",
  paragraph: "ocr_par",
  line: "ocr_line",
  word: "ocrx_word",
}

export const resolveNodeEntity = (node: Element): string => {
  let entity = null;
  Object.keys(hocrEntityMap).some(key => {
    const match = node.classList.contains(hocrEntityMap[key]);
    if (match) entity = key;
    return match;
  });

  return entity;
};

export const CreateNodeClassNameResolver = (classNameMapper: HocrStyleMap) =>{
  return {
    
    get(className: string): boolean {
      return classNameMapper.word === className;
    }
  }  
};

export const CreateWordComparator = (targetWords: string[], caseSensitive: boolean = false) => {
  if (!targetWords || targetWords.length <= 0) return null;
  
  const parsedTargetWords = caseSensitive ? targetWords : targetWords.map(w => w.toLowerCase());
  return (word: string): boolean => {
    return parsedTargetWords.indexOf(caseSensitive ? word : word.toLowerCase()) >= 0;
  }
};

export const parseHocr = (hocr: string): Document => {
  const domParser = new DOMParser();
  return domParser.parseFromString(hocr, "text/html");
}

export const parsePageIndex = (doc: Document, pageIndex: PageIndex, wordComparator: WordComparator): number => {
  if (typeof pageIndex === "number") {
    return (pageIndex < 0 || !checkPageIndexInRange(doc, pageIndex)) ? 0 : pageIndex;
  } else {  // Auto page index based on the first ocurrence of a target word.
    return wordComparator ? firstOcurrencePage(doc, wordComparator) : 0;
  }  
};

const checkPageIndexInRange = (doc: Document, pageIndex: number) => {
  return doc.body && doc.body.children && (pageIndex < doc.body.children.length);
};

const firstOcurrencePage = (doc: Document, wordComparator: WordComparator) => {
  let foundIndex = 0;
  Array.from(doc.body.children).some((page, index) => {
    const found = areWordsInPage(page, wordComparator);
    if (found) foundIndex = index;
    return found;
  });
  return foundIndex;
};

const areWordsInPage = (page: Element, wordComparator: WordComparator): boolean => {
  const pageWords = page.getElementsByClassName(hocrEntityMap.word);
  return Array.from(pageWords).some((word, index) => {
    return wordComparator(word.textContent);
  })
};

export const getNodeId = (node: Element, suffix: string): string => {
  const id = node.getAttribute("id");
  return id && suffix ? composeIdSuffix(id, suffix) : "";
};

export const composeIdSuffix = (id: string, suffix: string): string => `${id}-${suffix}`;

const optionArrayFields = ['bbox', 'baseline', 'scan_res'];

export const getNodeOptions = (node: Element): any => {
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

export const calculateNodeShiftInContainer = (nodeId: string, containerId: string) => {
  const target = document.getElementById(nodeId);
  const container = document.getElementById(containerId);
  if (!target || !container) return null;
  
  const cbbox = container.getAttribute('viewBox').split(" ").map(n => parseInt(n));
  const originalWidth = cbbox[2] - cbbox[0];
  const originalHeight = cbbox[3] - cbbox[1];
  const targetLeft = parseInt(target.getAttribute('x')) - cbbox[0];
  const targetTop = parseInt(target.getAttribute('y')) - cbbox[1];
  const targetCentroidLeft = targetLeft + (parseInt(target.getAttribute('width')) / 2);
  const targetCentroidTop = targetTop + (parseInt(target.getAttribute('height')) / 2);
  const targetCentroidPosX = targetCentroidLeft / originalWidth;
  const targetCentroidPosY = targetCentroidTop / originalHeight;

  return {x: targetCentroidPosX, y: targetCentroidPosY};
}