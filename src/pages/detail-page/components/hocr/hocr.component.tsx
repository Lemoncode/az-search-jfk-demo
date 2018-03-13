import * as React from "react";
import { HocrProofreader } from "./hocr.business";

const style = require("./hocr.style.scss");

/**
 * HOCR-Proofreader third party wrapper for React.
 */

const layoutContainerId = "hocr-layout-container-id";
const editorContainerId = "hocr-editor-container-id";

type ZoomMode = "page-full" | "page-width" | "original";
type LayoutMode = "image" | "text" | "both";

interface HocrProps {
  hocr: string;
  zoom: ZoomMode;
  layout: LayoutMode;
  renderWords?: boolean;
  targetWords?: string[];
}

interface HocrState {
  hocrPR: any;
}

export class HocrComponent extends React.Component<HocrProps, HocrState> {
  constructor(props) {
    super(props);

    this.state = {
      hocrPR: null,
    }
  }

  public componentDidMount() {
    this.setState({
        ...this.state,
        hocrPR: CreateHocr(this.props.hocr, this.props.targetWords),
    }, () => updateHocr(this.state.hocrPR, this.props));
  }

  public componentWillReceiveProps(nextProps: HocrProps) {
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
}

const CreateHocr = (hocr: string, targetWords: string[] = null) => {
    const hocrProofreader = new HocrProofreader({
      layoutContainer: layoutContainerId,
      editorContainer: editorContainerId,
    });
    hocrProofreader.setHocr(hocr || "", targetWords);
    return hocrProofreader;
}

const updateHocr = (hocrPR: any, props: HocrProps) => {
  if (hocrPR) {
    // hocrPR.setZoom(props.zoom);
    // hocrPR.toggleLayoutWords(props.renderWords);    
  }
}

const getLayoutClassName = (layout: LayoutMode) => {
  return layout !== "text" ? 
      style.layoutContainer : style.layoutContainerHidden;
}

const getEditorClassName = (layout: LayoutMode) => {
  return layout !== "image" ? 
      style.editorContainer : style.editorContainerHidden;
}