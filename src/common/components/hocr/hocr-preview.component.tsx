import * as React from "react";
import {
  calculateNodeShiftInContainer,
  composeId,
  PageIndex,
  parseHocr,
  CreateWordComparator,
  WordComparator,
  parseWordPosition,
  getNodeId
} from "./hocr-utils";
import {
  ZoomMode,
  HocrPageStyleMap,
  HocrPageComponent
} from "./hocr-page.component";

const style = require("./hocr-preview.style.scss");

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
  onlyTargetWords?: boolean;
  focusToNodeId?: string;
  styleMap?: HocrPageStyleMap;
};

interface HocrPreviewState {
  pageNode: Element;
  wordCompare: WordComparator;
  scrollToId: string;
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

  private scrollToNodeId = (nodeId: string) => {
    if (this.containerRef && nodeId) {
      // Calculate scroll shift to reveal node right in the
      // center of the container.
      const targetId = composeId(nodeId, idSuffix);
      const pageNodeId = getNodeId(this.state.pageNode, idSuffix);
      const shift = calculateNodeShiftInContainer(targetId, pageNodeId);
      if (shift) {
        const {x, y} = shift;
        const scrollLeft = this.containerRef.scrollWidth * x - (this.containerRef.clientWidth / 2); 
        const scrollTop = this.containerRef.scrollHeight * y - (this.containerRef.clientHeight / 2);
        this.containerRef.scrollTo({left: scrollLeft, top: scrollTop});
      }      
    }
  }

  private calculateWholeState = (props: HocrPreviewProps): HocrPreviewState => {
    let state = {
      pageNode: null,
      wordCompare: null,
      scrollToId: null,
    };

    if (props.hocr) {
      const doc = parseHocr(props.hocr);
      const wordCompare = CreateWordComparator(props.targetWords, props.caseSensitiveComparison);
      const {pageIndex, firstOcurrenceId} = parseWordPosition(doc, props.pageIndex, wordCompare);
      if (pageIndex !== null) {
        const pageNode = doc.body.children[pageIndex];
        const scrollToId = this.props.focusToNodeId || firstOcurrenceId;
        state = {pageNode, wordCompare, scrollToId};
      }
    }
    return state;
  };

  private setStateForScrollToId = (scrollToId: string) => {
    this.setState({
      ...this.state,
      scrollToId,
    })
  }

  // *** Lifecycle ***

  public componentDidMount() {
    // Scroll to reveal target node if needed.
    // This will be done only once, when component is mounted.
    this.scrollToNodeId(this.state.scrollToId);
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
    } else if ( this.props.focusToNodeId != nextProps.focusToNodeId ) {
      this.setStateForScrollToId(nextProps.focusToNodeId);
    }     
  }

  public componentDidUpdate(prevProps, prevState) {
    if (this.state.scrollToId !== prevProps.scrollToId) {
      this.scrollToNodeId(this.state.scrollToId);        
    }
  }

  public render() {
    return (
      <div className={style.container} ref={this.saveContainerRef}>
        <HocrPageComponent
          pageNode={this.state.pageNode}
          wordCompare={this.state.wordCompare}
          idSuffix={idSuffix}
          zoomMode={this.props.zoomMode}
          onlyTargetWords={this.props.onlyTargetWords}
          styleMap={this.props.styleMap}
        />
      </div>
    );
  }
};
