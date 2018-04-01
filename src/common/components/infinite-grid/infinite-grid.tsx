import * as React from 'react';
import { InfiniteLoader, Grid, AutoSizer, GridCellProps } from 'react-virtualized';
const styles = require('./infinite-grid.scss');

interface Props {
  list: any[];
  itemRenderer: any;
  onLoadMore: any;
  itemWidth: number;
}

export const InfiniteGrid: React.StatelessComponent<Props> = (props) => (
  <AutoSizer disableHeight={true}>
    {
      ({ width }) => {
        const columnCount = Math.floor(width / props.itemWidth);
        return (
          <InfiniteLoader
            isRowLoaded={isRowLoaded(props)}
            loadMoreRows={props.onLoadMore}
            rowCount={Infinity}
            threshold={1}
          >
            {
              ({ onRowsRendered, registerChild }) => (
                <Grid
                  className={styles.grid}
                  onSectionRendered={onSectionRendered(onRowsRendered, columnCount)}
                  ref={registerChild}
                  columnCount={columnCount}
                  columnWidth={props.itemWidth}
                  rowCount={rowCountGrid(props, columnCount)}
                  cellRenderer={onGridRowRendered(props, columnCount)}
                  rowHeight={416}
                  height={900}
                  width={width}
                />
              )
            }
          </InfiniteLoader>
        );
      }
    }
  </AutoSizer>
);

const isRowLoaded = (props: Props) => ({ index }) => (
  !!props.list[index]
);

const rowCountGrid = (props: Props, columnCount: number) => {
  return Array.isArray(props.list) && props.list.length > 0 ?
    Math.ceil(props.list.length / columnCount) :
    0
};

const onSectionRendered = (onRowsRendered, columnCount: number) =>
  ({ columnStartIndex, columnStopIndex, rowStartIndex, rowStopIndex }) => {
    const startIndex = columnStartIndex + (rowStartIndex * columnCount);
    const stopIndex = columnStopIndex + (rowStopIndex * columnCount);

    onRowsRendered({ startIndex, stopIndex });
  };

const onGridRowRendered = (props: Props, columnCount: number) =>
  ({ columnIndex, rowIndex, ...cellProps }: GridCellProps) => {
    const index = columnIndex + (rowIndex * columnCount);
    return props.itemRenderer({
      ...cellProps,
      index,
    });
  };
