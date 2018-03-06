import * as React from "react"
import { FacetCollection, FilterCollection, Filter } from "../../view-model";
import { FacetItemComponent } from "./facet-item.component";

const style = require("./facet-view.style.scss");


interface FacetViewProps {
  facets: FacetCollection;
  filters: FilterCollection;
  onFilterUpdate: (newFilter: Filter) => void;
}

const FacetViewComponent: React.StatelessComponent<FacetViewProps> = (props) => {
  return props.facets ? (
    <div className={style.container}>
      { props.facets.map((facet, index) => {
        const filter = props.filters ? 
          props.filters.find(f => f.fieldId === facet.fieldId) : null;
        return (
          <FacetItemComponent
            facet={facet}
            filter={filter}
            onFilterUpdate={props.onFilterUpdate}
            key={index}
          />
        )        
      })}
    </div>
  ) : null;
}

export { FacetViewComponent };