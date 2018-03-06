import * as React from "react"
import Card, { CardActions, CardContent } from "material-ui/Card";
import Typography from "material-ui/Typography";
import Collapse from "material-ui/transitions/Collapse";
import { Facet, Filter } from "../../view-model";
import { Chevron } from "../../../../common/components/chevron";
import { Icon } from "material-ui";
import { CreateSelectionControl } from "../selection-controls";

const style = require("./facet-item.style.scss");

interface FacetItemProps {
  facet: Facet;
  filter: Filter;
  onFilterUpdate: (newFilter: Filter) => void;
}

interface State {
  expanded: boolean;
}

class FacetItemComponent extends React.Component<FacetItemProps, State> {
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
    const { facet, filter, onFilterUpdate } = this.props;
    const { expanded } = this.state;

    if (!facet.values) { return null }

    return (
      <Card classes={{root:style.item}} elevation={0}>
        <CardActions classes={{root: style.itemActions}}>
          <div className={style.itemTitle}>
            { facet.iconName ? 
              <Icon classes={{root: style.itemIcon}} color="action">
                {facet.iconName}
              </Icon>
              : null
            }            
            <Typography variant="title">
              {facet.displayName}
            </Typography>
          </div>          
          <Chevron onClick={this.toggleExpand} expanded={expanded}/>
        </CardActions>
        <Collapse in={expanded} timeout="auto">
          <div className={style.controlContainer}>
            {CreateSelectionControl(facet, filter, onFilterUpdate)}
          </div>          
        </Collapse>  
      </Card>
    );
  }  
}

export { FacetItemComponent };