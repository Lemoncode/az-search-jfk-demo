import * as React from "react";
import { findDOMNode } from "react-dom";
import { ZoomMode, HocrPageComponent } from "./hocr-page.component";
import { injectDefaultDocumentStyle, HocrDocumentStyleMap } from "./hocr-document.style";
import {
  parseHocr,
  CreateWordComparator,
  WordComparator,
  resolveNodeEntity,
  getNodeById,
} from "./hocr-common.util";
import { cnc } from "../../../util";

const style = require("./hocr-document.style.scss");


/**
 * HOCR Document
 */

export interface HocrDocumentProps {
  hocr: string;
  targetWords?: string[];
  caseSensitiveComparison?: boolean;
  autoFocusId?: string;
  hightlightId?: string;
  userStyle?: HocrDocumentStyleMap;
  onWordHover?: (wordId: string) => void;
  onPageHover?: (pageIndex: number) => void;
  className?: string;
};

interface HocrDocumentState {
  docBody: Element;
  wordCompare: WordComparator;
  autoFocusNode: Element;
  safeStyle: HocrDocumentStyleMap;
}

export class HocrDocumentComponent extends React.Component<HocrDocumentProps, HocrDocumentState> {
  constructor(props) {
    super(props);

    this.state = {
      docBody: getDocumentBody(props.hocr),
      wordCompare: CreateWordComparator(props.targetWords, props.caseSensitiveComparison),
      safeStyle: injectDefaultDocumentStyle(props.userStyle),
      autoFocusNode: null,
    }
  }

  private viewportRef = null;

  private saveViewportRef = (node) => {
    this.viewportRef = node;
  }

  private scrollTo = (node: Element) => {
    if (node) node.scrollIntoView({behavior: 'smooth', block: 'start'});
  }
  
  private resetHighlight = (node: Element) => {
    if (node) node.classList.remove(this.state.safeStyle["highlight"]);
  }

  private setHighlight = (node: Element) => {
    if (node) node.classList.add(this.state.safeStyle["highlight"]);
  }

  private autoFocusToNode = (nodeId: string) => {
    this.resetHighlight(this.state.autoFocusNode);
    if (nodeId) {      
      const focusNode = getNodeById(this.viewportRef, nodeId);
      this.setHighlight(focusNode);
      this.scrollTo(focusNode);
      this.setState({
        ...this.state,
        autoFocusNode: focusNode,
      });
    }
  }

  // *** Lifecycle ***

  public componentDidMount() {
    if (this.props.autoFocusId) {
      this.scrollTo(getNodeById(this.viewportRef, this.props.autoFocusId));
    }
  }

  public componentWillReceiveProps(nextProps: HocrDocumentProps) {
    if( this.props.hocr !== nextProps.hocr) {
      this.setState({
        ...this.state,
        docBody: getDocumentBody(nextProps.hocr)
      })
    } else if (
        this.props.targetWords !== nextProps.targetWords ||
        this.props.caseSensitiveComparison !== nextProps.caseSensitiveComparison
    ) {
      this.setState({
        ...this.state,
        wordCompare: CreateWordComparator(nextProps.targetWords, nextProps.caseSensitiveComparison),
      });
    } else if ( this.props.userStyle != nextProps.userStyle ) {
      this.setState({
        ...this.state,
        safeStyle: injectDefaultDocumentStyle(nextProps.userStyle),
      });
    } else if (this.props.autoFocusId !== nextProps.autoFocusId) {
      this.autoFocusToNode(nextProps.autoFocusId);
    }
  }

  public shouldComponentUpdate(nextProps: HocrDocumentProps, nextState: HocrDocumentState) {
    return ( 
      this.props.hocr !== nextProps.hocr ||
      this.props.targetWords !== nextProps.targetWords ||
      this.props.caseSensitiveComparison !== nextProps.caseSensitiveComparison ||
      this.props.userStyle !== nextProps.userStyle ||
      this.props.onWordHover !== nextProps.onWordHover ||
      this.props.onPageHover !== nextProps.onPageHover ||
      this.props.className !== nextProps.className ||
      this.state.docBody !== nextState.docBody ||
      this.state.wordCompare !== nextState.wordCompare
    );
  }

  public render() {
    if (!this.state.docBody || !this.state.docBody.children) return null;
    return (
      <div className={cnc(style.container, this.props.className)}>
        <div className={style.viewport} ref={this.saveViewportRef}>
         { getDocNodeChildrenComponents({
            node: this.state.docBody,
            index: 0,
            wordCompare: this.state.wordCompare,
            userStyle: this.state.safeStyle,
            onWordHover: this.props.onWordHover,
            onPageHover: this.props.onPageHover,
         })}
        </div>
      </div>
    );
  }
};

const getDocumentBody = (hocr: string) => {
  if (!hocr) return null;
  const doc = parseHocr(hocr);
  return doc.body
}


/**
 * HOCR Document Nodes
 */

interface HocrDocNodeProps {
  node: Element;
  index: number;
  wordCompare: WordComparator;
  userStyle: HocrDocumentStyleMap;
  onWordHover?: (wordId: string) => void;
  onPageHover?: (pageIndex: number) => void;
}

const HocrDocNodeComponent: React.StatelessComponent<HocrDocNodeProps> = (props) => {
  const nodeChildren = getDocNodeChildrenComponents(props);
  const entity = resolveNodeEntity(props.node);
  const isTarget = (entity === "word") && props.wordCompare && props.wordCompare(props.node.textContent);
  const className = cnc(props.userStyle[entity], isTarget && props.userStyle["target"]);
  const nodeType = resolveTypeFromEntity(entity);
  const nodeProps = {
      className,
      id: props.node.id,
      index: props.index,
    ...resolveEventHandlersFromEntity(entity, props),
  }
  const reactElement = React.createElement(nodeType, nodeProps, nodeChildren);

  return (nodeType === "span") ? 
    <>{reactElement}{" "}</>  // Add literal whitespace to span ending.
    : reactElement;
}

const resolveTypeFromEntity = (entity: string): string => {
  switch (entity) {
    case "word":
    case "line":
      return "span";
    case "paragraph":
      return "p";
    default:
      return "div";
  }
}

const resolveEventHandlersFromEntity = (entity: string, props: HocrDocNodeProps) => {
  if (entity === "word") {
    return {
      onMouseEnter: () => props.onWordHover && props.onWordHover(props.node.id),
      onMouseLeave: () => props.onWordHover && props.onWordHover(null),
    }
  } else if (entity === "page") {
    return {
      onMouseEnter: () => props.onPageHover && props.onPageHover(props.index),
    }
  }
  return null;
}

export const getDocNodeChildrenComponents = (props: HocrDocNodeProps) => {
  return (props.node.children && props.node.children.length) ? 
    Array.from(props.node.children).map((child, index) => 
      <HocrDocNodeComponent
        {...props}
        node={child}
        key={index}
        index={index}
      />
    ) : props.node.textContent;
  }
