import * as React from 'react';
import { ItemComponent } from './item.component';
import { ItemCollection, Item } from '../../view-model';
import { InfiniteGrid } from '../../../../common/components/infinite-grid';
const style = require('./item-collection-view.style.scss');

interface Props {
  items?: ItemCollection;
  activeSearch?: string;
  onClick?: (item: Item) => void;
  onLoadMore: (startIndex: number) => void;
}

export const ItemCollectionViewComponent: React.StatelessComponent<Props> = (props) => (
  <InfiniteGrid
    onLoadMore={props.onLoadMore}
    itemWidth={304}
    itemRenderer={itemRenderer(props)}
    list={props.items}
  />
);

const itemRenderer = (props: Props) => ({ key, index }) => (
  Boolean(props.items[index]) ?
    <ItemComponent
      key={key}
      item={props.items[index]}
      activeSearch={props.activeSearch}
      onClick={props.onClick}
    /> :
    'Loading ....'
)

// class ItemCollectionView extends React.Component<ItemViewProps, {}> {
//   public constructor(props) {
//     super(props);
//   }

//   public render() {
//     return (    
//       <div className={style.container}>
//         { this.props.items ? 
//           this.props.items.map((child, index) => (
//             <ItemComponent
//               item={child}
//               activeSearch={this.props.activeSearch}
//               onClick={this.props.onClick}
//               key={index}
//             />
//           ))
//         : null }
//       </div>
//     );
//   }  
// }

// export const ItemCollectionViewComponent = infiniteScroll(ItemCollectionView);
