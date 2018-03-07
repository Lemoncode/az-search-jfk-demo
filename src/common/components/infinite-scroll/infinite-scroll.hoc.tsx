import * as React from "react";
import * as ReactDOM from 'react-dom';
import * as throttle from 'lodash.throttle';
import { CircularProgress } from 'material-ui/Progress';
import Typography from "material-ui/Typography";

const style = require("./infinite-scroll.style.scss");


interface InfiniteScrollProps {
  onLoadMore: () => void;
  loading: boolean;
  noMoreResults?: boolean;
  scrollThreshold?: number;
}

export const infiniteScroll = function<P extends InfiniteScrollProps>(
  WrappedComponent: React.ComponentClass<P>
) {
  return class InfiniteScrollHOC extends React.Component<P, any> {
    constructor(props) {
      super(props);
    }

    private containerRef = null;

    private setRef = (ref) => {
      this.containerRef = ref;
    }

    private onScroll = () => {
      if (!this.props.loading) {
        const viewNode = ReactDOM.findDOMNode(this.containerRef);
        const currentScrollPositionAtBottom = viewNode.scrollTop + viewNode.getBoundingClientRect().height;
        const scrollThresholdAtBottom = viewNode.scrollHeight - (this.props.scrollThreshold || 300);

        if ( currentScrollPositionAtBottom >= scrollThresholdAtBottom) {
          this.props.onLoadMore();
        }
      }
    }

    private onThrottledScroll = throttle(this.onScroll, 500);
  
    public componentDidMount() {
      ReactDOM.findDOMNode(this.containerRef).addEventListener('scroll', this.onThrottledScroll, false)
    }
  
    public componentWillUnmount() {
      ReactDOM.findDOMNode(this.containerRef).removeEventListener('scroll', this.onThrottledScroll, false)
    }

    public render() {
      return (
        <div className={style.container} ref={this.setRef} >
          <WrappedComponent {...this.props} />
          <LoadIndicator 
            loading={this.props.loading}
            noMoreResults={this.props.noMoreResults}
          />
        </div>
      );
    }
  }
}

const LoadIndicator = ({loading, noMoreResults}) => {
  const loaderStyle = loading? style.loader : style.loaderHidden;

  return noMoreResults ? 
  <Typography className={style.message} variant="subheading" color="primary">
    No More Results Available
  </Typography>
  : <CircularProgress classes={{root: loaderStyle}}/>;
}