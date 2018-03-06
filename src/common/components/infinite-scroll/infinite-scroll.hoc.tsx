import * as React from "react";
import * as ReactDOM from 'react-dom';
import * as throttle from 'lodash.throttle';
import { CircularProgress } from 'material-ui/Progress';

const style = require("./infinite-scroll.style.scss");


interface InfiniteScrollProps {
  onLoadMore: () => void;
  loading: boolean;
  scrollThreshold?: number;
}

export const infiniteScroll = function<P extends InfiniteScrollProps>(
  WrappedComponent: React.ComponentClass<P>
) {
  return class InfiniteScrollHOC extends React.Component<P, any> {
    constructor(props) {
      super(props);
    }

    private wrappedRef = null;

    private setRef = (ref) => {
      this.wrappedRef = ref;
    }

    private onScroll = () => {
      if (!this.props.loading) {
        const viewNode = ReactDOM.findDOMNode(this.wrappedRef);
        const currentScrollPositionAtBottom = viewNode.scrollTop + viewNode.getBoundingClientRect().height;
        const scrollThresholdAtBottom = viewNode.scrollHeight - (this.props.scrollThreshold || 300);

        if ( currentScrollPositionAtBottom >= scrollThresholdAtBottom) {
          this.props.onLoadMore();
        }
      }
    }

    private onThrottledScroll = throttle(this.onScroll, 500);
  
    public componentDidMount() {
      ReactDOM.findDOMNode(this.wrappedRef).addEventListener('scroll', this.onThrottledScroll, false)
    }
  
    public componentWillUnmount() {
      ReactDOM.findDOMNode(this.wrappedRef).removeEventListener('scroll', this.onThrottledScroll, false)
    }
  
    public render() {
      return (
        <div className={style.container}>
          <WrappedComponent ref={this.setRef} {...this.props} />
          { this.props.loading ? 
            <CircularProgress classes={{root: style.loader}}/>
            : null 
          }
        </div>
      );
    }
  }
}
