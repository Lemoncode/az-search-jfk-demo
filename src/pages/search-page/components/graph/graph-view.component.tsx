import * as React from "react";
import {
  GraphApi,
  CreateGraphApi,
  GraphConfig,
  defaultGraphConfig,
  GraphResponse
} from "../../../../graph-api";
import { cnc } from "../../../../util";

const style = require("./graph-view.style.scss");

interface GraphViewProps {
  searchValue: string;
  graphConfig?: GraphConfig;
  className?: string;
}

interface GraphViewState {
  graphApi: GraphApi;
  graphDescriptor: GraphResponse;
}

export class GraphViewComponent extends React.PureComponent<GraphViewProps, GraphViewState> {
  constructor(props) {
    super(props);

    this.state = {
      graphApi: CreateGraphApi(defaultGraphConfig),
      graphDescriptor: null,
    }
  }

  private fetchGraphDescriptor = async () => {
    if (!this.state.graphApi || !this.props.searchValue) return Promise.reject(null);

    try {
      const payload = {search: this.props.searchValue};
      return await this.state.graphApi.runQuery(payload);
    } catch (e) {
      throw e;
    }
  };

  private updateGraphDescriptor = () => {
    this.fetchGraphDescriptor()
      .then(graphDescriptor => this.setState({
        ...this.state,
        graphDescriptor, 
      }))
      .catch(e => console.log(e));
  }

  private updateGraphApiAndDescriptor = () => {
    this.setState({
      ...this.state,
      graphApi: CreateGraphApi(this.props.graphConfig || defaultGraphConfig),
    }, this.updateGraphDescriptor);
  }

  public componentDidMount() {
    this.updateGraphApiAndDescriptor();
  };

  public componentWillReceiveProps(nextProps: GraphViewProps) {
    if (this.props.searchValue != nextProps.searchValue) {
      this.updateGraphDescriptor();
    } else if (this.props.graphConfig != nextProps.graphConfig) {
      this.updateGraphApiAndDescriptor();
    }
  }

  public render() {
    return (
      <div className={cnc(style.container, this.props.className)}>
        {JSON.stringify(this.state.graphDescriptor)}
      </div>
    );
  }
}