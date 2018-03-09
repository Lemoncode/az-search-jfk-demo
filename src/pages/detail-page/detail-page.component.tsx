import * as React from "react";
import { Link } from 'react-router-dom';

const style = require("./detail-page.style.scss");

interface DetailPageProps {
  hocr: string;
}

export class DetailPageComponent extends React.Component<DetailPageProps, {}> {
  constructor(props) {
    super(props);
  }

  public render() {
    return (
      <div>
        {this.props.hocr || "No Data"}
      </div>
    );
  }
}
