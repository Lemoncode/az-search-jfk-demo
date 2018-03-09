import * as React from "react";
import { Link } from 'react-router-dom';
import { HocrComponent } from "./components/hocr";

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
      <HocrComponent hocr={this.props.hocr} />
    );
  }
}
