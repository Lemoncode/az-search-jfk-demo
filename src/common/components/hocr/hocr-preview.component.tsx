import * as React from "react";
import { ZoomMode, HocrPageComponent } from "./hocr-page.component";
import { HocrUserStyleMap } from "./hocr-common.style";
import {
  calculateNodeShiftInContainer,
  PageIndex,
  parseHocr,
  CreateWordComparator,
  WordComparator,
  parseWordPosition,
  getNodeById,
} from "./hocr-common.util";
import { cnc } from "../../../util";


const styleFile = require("./hocr-preview.style.scss");

const idSuffix = "preview";


/**
 * HOCR-Preview
 */

export interface HocrPreviewProps {
  hocr: string;
  pageIndex: PageIndex;
  zoomMode: ZoomMode;
  targetWords?: string[];
  caseSensitiveComparison?: boolean;
  renderOnlyTargetWords?: boolean;
  scrollToId?: string;
  disabelScroll?: boolean;
  userStyle?: HocrUserStyleMap;
  onWordHover?: (wordId: string) => void;
};

interface HocrPreviewState {
  pageNode: Element;
  wordCompare: WordComparator;
  scrollToNode: Element;
}

export class HocrPreviewComponent extends React.Component<HocrPreviewProps, HocrPreviewState> {
  constructor(props) {
    super(props);

    this.state = this.calculateWholeState(props);
  }

  private containerRef = null;

  private saveContainerRef = (node) => {
    this.containerRef = node;
  }

  private scrollToNode = (node: Element) => {
    if (this.containerRef && node && this.state.pageNode) {
      // Calculate scroll shift to reveal node right in the
      // center of the container.
      const shift = calculateNodeShiftInContainer(node, this.state.pageNode);
      if (shift) {
        const {x, y} = shift;
        const scrollLeft = this.containerRef.scrollWidth * x - (this.containerRef.clientWidth / 2); 
        const scrollTop = this.containerRef.scrollHeight * y - (this.containerRef.clientHeight / 2);
        this.containerRef.scrollTo({left: scrollLeft, top: scrollTop});
      }      
    }
  }

  private calculateWholeState = (props: HocrPreviewProps): HocrPreviewState => {
    let state: HocrPreviewState = {
      pageNode: null,
      wordCompare: null,
      scrollToNode: null,
    };

    if (props.hocr) {
      const doc = parseHocr(props.hocr);
      const wordCompare = CreateWordComparator(props.targetWords, props.caseSensitiveComparison);
      const {pageIndex, firstOcurrenceNode} = parseWordPosition(doc, props.pageIndex, wordCompare);
      if (pageIndex !== null) {
        const pageNode = doc.body.children[pageIndex];
        let scrollToNode = firstOcurrenceNode;
        if(this.props.scrollToId) { // User has preference to scroll over its desired node.
          scrollToNode = getNodeById(pageNode, this.props.scrollToId);
        }        
        state = {pageNode, wordCompare, scrollToNode};
      }
    }
    return state;
  };

  private setStateForScrollToNode = (scrollToId: string) => {
    this.setState({
      ...this.state,
      scrollToNode: getNodeById(this.state.pageNode, this.props.scrollToId),
    })
  }

  // *** Lifecycle ***

  public componentDidMount() {
    // Scroll to reveal target node if needed.
    // This will be done only once, when component is mounted.
    this.scrollToNode(this.state.scrollToNode);
  }

  public componentWillReceiveProps(nextProps: HocrPreviewProps) {
    if( this.props.hocr !== nextProps.hocr ||
        this.props.pageIndex !== nextProps.pageIndex ||
        this.props.targetWords !== nextProps.targetWords ||
        this.props.caseSensitiveComparison !== nextProps.caseSensitiveComparison
    ) {
      this.setState({
        ...this.state,
        ...this.calculateWholeState(nextProps),
      });
    } else if ( this.props.scrollToId != nextProps.scrollToId ) {
      this.setStateForScrollToNode(nextProps.scrollToId);
    }     
  }

  public componentDidUpdate(prevProps: HocrPreviewProps, prevState: HocrPreviewState) {
    if (this.state.scrollToNode !== prevState.scrollToNode) {
      this.scrollToNode(this.state.scrollToNode);        
    }
  }

  public render() {
    return (
      <div className={cnc(styleFile.container, this.props.disabelScroll && styleFile.noScrollable )}
       ref={this.saveContainerRef}
      >
        <HocrPageComponent
          node={this.state.pageNode}
          wordCompare={this.state.wordCompare}
          idSuffix={idSuffix}
          zoomMode={this.props.zoomMode}
          renderOnlyTargetWords={this.props.renderOnlyTargetWords}
          userStyle={this.props.userStyle}
          onWordHover={this.props.onWordHover}
        />
      </div>
    );
  }
};
