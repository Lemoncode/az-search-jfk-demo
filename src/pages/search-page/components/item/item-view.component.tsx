import * as React from "react";
import { ItemComponent } from "./item.component";
import { ItemCollection } from "../../view-model";
import { infiniteScroll } from "../../../../common/components/infinite-scroll";

const style = require("./item-view.style.scss");


interface ItemView {
  items?: ItemCollection;
}

class ItemViewClass extends React.Component<ItemView, {}> {
  public constructor(props) {
    super(props);
  }
  
  public render() {
    return (    
      <div className={style.container}>
        { this.props.items ? 
          this.props.items.map((child, index) => (
            <ItemComponent item={child} key={index} />
          ))
        : null }
      </div>
    );
  }  
}

export const ItemViewComponent = infiniteScroll(ItemViewClass);