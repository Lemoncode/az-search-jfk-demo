import * as React from "react"
import { Item } from "../../view-model";
import { Chevron } from "../../../../common/components/chevron";
import { HocrPreviewComponent } from "../../../../common/components/hocr";
import Card, { CardActions, CardContent, CardMedia } from "material-ui/Card";
import List, { ListItem, ListItemIcon, ListItemText} from 'material-ui/List';
import Collapse from "material-ui/transitions/Collapse";
import Typography from "material-ui/Typography";
import Chip from 'material-ui/Chip';
import StarIcon from "material-ui-icons/Star";
import { withStyles, WithStyles } from "material-ui/styles";

import { itemStyle } from "./item.style";
const style = require("./item.style.scss");


interface ItemProps {
  item: Item;
  activeSearch?: string;
  onClick?: (item: Item) => void;
  simplePreview?: boolean;
  classes?: any;
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

const ItemMediaThumbnail: React.StatelessComponent<ItemProps> = ({ item, onClick, classes }) => {
  return (
    item.thumbnail ? 
    <CardMedia className={classes.media}
      component="img"
      src={item.thumbnail}        
      title={item.title}
      onClick={handleOnClick({ item, onClick })}
    /> : null
  );
}

const ItemMediaHocrPreview: React.StatelessComponent<ItemProps> = ({ item, activeSearch, onClick, classes }) => {
  return (
    <div className={classes.media}
     onClick={handleOnClick({ item, onClick })}
    >
      <HocrPreviewComponent
        hocr={item.metadata}
        pageIndex="auto"
        zoomMode="original"
        targetWords={activeSearch && activeSearch.split(" ")}
        renderOnlyTargetWords={true}
        disabelScroll={true}
      />
    </div>
  );
}

const ItemMedia: React.StatelessComponent<ItemProps> = (
  { item, activeSearch, onClick, simplePreview, classes }) => {
  return (
    simplePreview ? 
      <ItemMediaThumbnail
        item={item}
        onClick={onClick}
        classes={classes}
      /> :
      <ItemMediaHocrPreview
        item={item}
        activeSearch={activeSearch}
        onClick={onClick}
        classes={classes}
      />
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

class ItemInner extends React.Component<ItemProps, State> {
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
    const {item, activeSearch, onClick, classes } = this.props;

    return (
      <Card classes={{root: classes.card}}
        elevation={8}>
        <ItemMedia
          classes={classes}
          item={item}
          activeSearch={activeSearch}
          onClick={onClick}
        />
        <ItemCaption item={item} onClick={onClick} />
        <CardActions classes={{root: classes.actions}}>
          <div className={classes.rating}>
            {ratingStars(item)}
          </div>          
          <Chevron className={classes.chevron}
            onClick={this.toggleExpand} expanded={this.state.expanded} />
        </CardActions>
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <ItemExtraFieldList item={item} />
        </Collapse>  
      </Card>
    );
  }  
}
export const ItemComponent = withStyles(itemStyle)(ItemInner);