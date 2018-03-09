import * as React from "react";
import { withRouter, RouteComponentProps } from 'react-router';
import { DetailPageComponent } from "./detail-page.component";


const DetailPageInnerContainer: React.StatelessComponent<RouteComponentProps<any>> = (props) => {
  const { location } = props;
  
  return (
    <DetailPageComponent hocr={location && location.state && location.state.metadata} />
  )
}

export const DetailPageContainer = withRouter(DetailPageInnerContainer);