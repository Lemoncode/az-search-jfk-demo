import * as React from "react";
import { ItemComponent } from "./item.component";
import { ItemCollection, Item } from "../../view-model";
import { infiniteScroll } from "../../../../common/components/infinite-scroll";

const style = require("./item-collection-view.style.scss");


interface ItemViewProps {
  items?: ItemCollection;
  onClick?: (item: Item) => void;
}

class ItemCollectionViewClass extends React.Component<ItemViewProps, {}> {
  public constructor(props) {
    super(props);
  }
  
  public render() {
    return (    
      <div className={style.container}>
        { this.props.items ? 
          this.props.items.map((child, index) => (
            <ItemComponent item={child} onClick={this.props.onClick} key={index} />
          ))
        : null }
      </div>
    );
  }  
}

export const ItemCollectionViewComponent = infiniteScroll(ItemCollectionViewClass);