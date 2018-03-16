import * as React from "react"
import { Item } from "../../view-model";
import { Chevron } from "../../../../common/components/chevron";
import Card, { CardActions, CardContent, CardMedia } from "material-ui/Card";
import List, { ListItem, ListItemIcon, ListItemText} from 'material-ui/List';
import Collapse from "material-ui/transitions/Collapse";
import Typography from "material-ui/Typography";
import Chip from 'material-ui/Chip';
import StarIcon from "material-ui-icons/Star";
import { HocrPreviewComponent } from "../../../../common/components/hocr";

const style = require("./item.style.scss");


interface ItemProps {
  item: Item;
  targetWords?: string[];
  onClick?: (item: Item) => void;
  simplePreview?: boolean;
}

interface State {
  expanded: boolean;
}

const handleOnClick = ({item, onClick}) => () => onClick? onClick(item) : null;

const ratingStars = (item: Item) => ((item.rating >= 1.0) ? 
  Array(Math.floor(item.rating)).fill(0).map((item, index) => (
    <StarIcon key={index} classes={{root: style.itemStar}} color="secondary" />
  )) : null
);

const ItemMediaThumbnail: React.StatelessComponent<ItemProps> = ({ item, onClick }) => {
  return (
    item.thumbnail ? 
    <CardMedia className={style.itemMedia}
      component="img"
      src={item.thumbnail}        
      title={item.title}
      onClick={handleOnClick({ item, onClick })}
    /> : null
  );
}

const ItemMediaHocrPreview: React.StatelessComponent<ItemProps> = ({ item, targetWords, onClick }) => {
  return (
    <div className={style.itemMedia}
     onClick={handleOnClick({ item, onClick })}
    >
      <HocrPreviewComponent
        hocr={item.metadata}
        pageIndex="auto"
        zoomMode="original"
        targetWords={targetWords}
        onlyTargetWords={true}
        disabelScroll={true}
      />
    </div>
  );
}

const ItemMedia: React.StatelessComponent<ItemProps> = ({ item, targetWords, onClick, simplePreview }) => {
  return (
    simplePreview ? 
      <ItemMediaThumbnail item={item} onClick={onClick} /> :
      <ItemMediaHocrPreview item={item} targetWords={targetWords} onClick={onClick} />
  );
}

const ItemCaption: React.StatelessComponent<ItemProps> = ({ item, onClick }) => {
  return (
    <CardContent classes={{root: style.itemCaption}}
      onClick={handleOnClick({ item, onClick })}
    >
      <Typography variant="headline" component="h2">
        {item.title} 
        <span className={style.subtitle}>
          {item.subtitle}
        </span>
      </Typography>        
      <Typography component="p">
        {item.excerpt}
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

const ItemExtraFieldList: React.StatelessComponent<ItemProps> = ({ item }) => {
  if (item.extraFields) {
    return (
      <CardContent><List>
        {
          item.extraFields.map((field, fieldIndex) => 
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
    const {item, targetWords, onClick} = this.props;

    return (
      <Card classes={{root:style.item}} elevation={8}>
        <ItemMedia item={item} targetWords={targetWords} onClick={onClick} />
        <ItemCaption item={item} onClick={onClick} />
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