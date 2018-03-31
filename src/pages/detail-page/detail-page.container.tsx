import * as React from "react";
import { withRouter, RouteComponentProps } from 'react-router';
import { DetailPageComponent } from "./detail-page.component";
import { DetailRouteState } from "./detail-page.route";
import { searchPath } from "../search-page";
import { ZoomMode } from "../../common/components/hocr";
import { getDetailState } from "./detail-page.memento";


interface DetailPageState {
  showText: boolean;
  zoomMode: ZoomMode;
}

class DetailPageInnerContainer extends React.Component<RouteComponentProps<any>, DetailPageState> {
  constructor(props) {
    super(props);

    this.state = {
      zoomMode: "original",
      showText: true,
    };
  }
  
  private handleClose = () => {
    this.props.history.push(searchPath);
  }

  private handleToggleText = () => {
    this.setState({
      ...this.state,
      showText: !this.state.showText,
    });      
  }

  private handleZoomChange = (zoomMode: ZoomMode) => {
    this.setState({...this.state, zoomMode,});
  }

  public render() {
    const { location } = this.props;    
    const detailState = getDetailState();
    
    return (
      <DetailPageComponent
        hocr={detailState.hocr}
        targetWords={detailState.targetWords}
        zoomMode={this.state.zoomMode}
        showText={this.state.showText}
        onToggleTextClick={this.handleToggleText}
        onZoomChange={this.handleZoomChange}
        onCloseClick={this.handleClose}
      />
    );
  }  
}

export const DetailPageContainer = withRouter(DetailPageInnerContainer);