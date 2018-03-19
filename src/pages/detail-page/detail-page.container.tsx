import * as React from "react";
import { withRouter, RouteComponentProps } from 'react-router';
import { DetailPageComponent } from "./detail-page.component";
import { DetailRouteState } from "./detail-page.route";


const DetailPageInnerContainer: React.StatelessComponent<RouteComponentProps<any>> = (props) => {
  const { location } = props;
  const detailState: DetailRouteState = location ? location.state : {hocr: "", targetWords: []};
  
  return (
    <DetailPageComponent hocr={detailState.hocr} targetWords={detailState.targetWords}/>
  )
}

export const DetailPageContainer = withRouter(DetailPageInnerContainer);