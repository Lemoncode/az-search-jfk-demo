import * as React from "react";
import { HocrProofreader } from "./hocr-business.js";

const style = require("./hocr-proofreader.style.scss");

/**
 * HOCR-Proofreader third party wrapper for React.
 */

const layoutContainerId = "hocr-proofreader-layout-container-id";
const editorContainerId = "hocr-proofreader-editor-container-id";

type ZoomMode = "page-full" | "page-width" | "original";
type LayoutMode = "image" | "text" | "both";

interface HocrProofreaderProps {
  hocr: string;
  layout: LayoutMode;
  zoom: ZoomMode;  
  renderWords?: boolean;
  targetWords?: string[];
}

interface HocrProofreaderState {
  hocrProofreader: any;
}

export class HocrProofreaderComponent extends React.Component<HocrProofreaderProps, HocrProofreaderState> {
  constructor(props) {
    super(props);

    this.state = {
      hocrProofreader: null,
    }
  }

  public componentDidMount() {
    this.setState({
        ...this.state,
        hocrProofreader: CreateHocrProofreader(this.props.hocr, this.props.targetWords),
    }, () => updateHocr(this.state.hocrProofreader, this.props));
  }

  public componentWillReceiveProps(nextProps: HocrProofreaderProps) {
    // TODO
  }

  public shouldComponentUpdate(nextProps, nextState) {
    return this.props.layout !== nextProps.layout;
  }

  public render() {
  return (
      <div className={style.container}>
        <div className={getLayoutClassName(this.props.layout)} id={layoutContainerId}>
        </div>
        <div className={getEditorClassName(this.props.layout)} id={editorContainerId}>
        </div>
      </div>
    );
  }
};

const CreateHocrProofreader = (hocr: string, targetWords: string[] = null) => {
    const hocrProofreader = new HocrProofreader({
      layoutContainer: layoutContainerId,
      editorContainer: editorContainerId,
    });
    hocrProofreader.setHocr(hocr || "", targetWords);
    return hocrProofreader;
};

const updateHocr = (hocrPR: any, props: HocrProofreaderProps) => {
  if (hocrPR) {
    hocrPR.setZoom(props.zoom);
    hocrPR.toggleLayoutWords(props.renderWords);    
  }
};

const getLayoutClassName = (layout: LayoutMode) => {
  return (layout === "image" || layout === "both") ?
    style.layoutContainer : style.layoutContainerHidden;
};

const getEditorClassName = (layout: LayoutMode) => {
  return (layout === "text" || layout === "both") ? 
      style.editorContainer : style.editorContainerHidden;
};