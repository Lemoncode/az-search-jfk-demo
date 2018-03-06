import * as React from "react"
import { Item } from "../../view-model";
import { Chevron } from "../../../../common/components/chevron";
import Card, { CardActions, CardContent, CardMedia } from "material-ui/Card";
import List, { ListItem, ListItemIcon, ListItemText} from 'material-ui/List';
import Collapse from "material-ui/transitions/Collapse";
import Typography from "material-ui/Typography";
import Chip from 'material-ui/Chip';
import StarIcon from "material-ui-icons/Star";


const style = require("./item.style.scss");


interface ItemProps {
  item: Item;
}

interface State {
  expanded: boolean;
}

const ratingStars = (item: Item) => ((item.rating >= 1.0) ? 
  Array(Math.floor(item.rating)).fill(0).map((item, index) => (
    <StarIcon key={index} classes={{root: style.itemStar}} color="secondary" />
  )) : null
);

const ItemMedia: React.StatelessComponent<ItemProps> = (props) => {
  return (
    props.item.thumbnail && props.item.thumbnail.length ? 
    <CardMedia className={style.itemMedia}
      component="img"
      src={props.item.thumbnail}        
      title={props.item.title}
    /> : null
  );
}

const ItemCaption: React.StatelessComponent<ItemProps> = (props) => {
  return (
    <CardContent classes={{root: style.itemCaption}}>
      <Typography variant="headline" component="h2">
        {props.item.title} 
        <span className={style.subtitle}>
          {props.item.subtitle}
        </span>
      </Typography>        
      <Typography component="p">
        {props.item.excerpt}
      </Typography>
    </CardContent>
  );
}

const generateExtraFieldContent = (field: any) => {
  if (typeof field == "string") {
    return <ListItemText primary={field} />
  } else if (field instanceof Array) {
    return (
      <div className={style.tagContainer}>
        {field.map((tag, tagIndex) => 
          <Chip label={tag} key={tagIndex} classes={{root: style.tag}}/>
        )}
      </div>);
  } else {
    return null;
  }
}

const generateExtraField = (field: any, index: number) => (
  field ? (
    <ListItem key={index}>
      { generateExtraFieldContent(field) }
    </ListItem>
  ) : null
);

const ItemExtraFieldList: React.StatelessComponent<ItemProps> = (props) => {
  if (props.item.extraFields) {
    return (
      <CardContent><List>
        {
          props.item.extraFields.map((field, fieldIndex) => 
            generateExtraField(field, fieldIndex))
        }
      </List></CardContent>
    );
  } else {
    return null;
  }
}

class ItemComponent extends React.Component<ItemProps, State> {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
    }
  }

  private toggleExpand = () => {
    this.setState({
      ...this.state,
      expanded: !this.state.expanded,
    });
  }
    
  public render() {
    const {item} = this.props;

    return (
      <Card classes={{root:style.item}} elevation={8}>
        <ItemMedia item={item} />
        <ItemCaption item={item} />
        <CardActions classes={{root: style.itemActions}}>
          <div className={style.itemRating}>
            {ratingStars(item)}
          </div>          
          <Chevron className={style.itemChevron}
            onClick={this.toggleExpand} expanded={this.state.expanded} />
        </CardActions>
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <ItemExtraFieldList item={item} />
        </Collapse>  
      </Card>
    );
  }  
}

export { ItemComponent };