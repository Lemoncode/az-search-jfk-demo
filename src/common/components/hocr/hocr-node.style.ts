import { HocrPreviewStyleMap } from "./hocr-common.style";

const style = require("./hocr-node.style.scss");

export interface HocrNodeStyleMap {
  area?: string;
  paragraph?: string;
  line?: string;
  word?: string;
  target?: string;
  highlight?: string;  
};

export const defaultNodeStyle: HocrNodeStyleMap = {
  area: style.area,
  paragraph: style.par,
  line: style.line,
  word: style.word,
  target: style.target,
  highlight: style.highlight,  
}

export const injectDefaultNodeStyle = (userStyle: HocrPreviewStyleMap): HocrPreviewStyleMap => {
  return {
    ...defaultNodeStyle,
    ...userStyle,
  };
}
