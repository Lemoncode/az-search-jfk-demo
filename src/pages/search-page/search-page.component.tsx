import * as React from "react";
import { PageBarComponent } from "./components/pageBar";
import { DrawerComponent } from "./components/drawer";
import { SearchComponent } from "./components/search";
import { ItemViewComponent } from "./components/item";
import { FacetViewComponent } from "./components/facets";
import {
  ItemCollection,
  FacetCollection,
  FilterCollection,
  Filter,
  SuggestionCollection,
} from "./view-model";
import { Service } from "./service";

const style = require("./search-page.style.scss");

interface SearchPageProps {
  activeService: Service;
  showDrawer: boolean;
  searchValue: string;
  itemCollection: ItemCollection;
  facetCollection: FacetCollection;
  filterCollection: FilterCollection;
  suggestionCollection?: SuggestionCollection;
  resultCount?: number;
  loading: boolean;
  onSearchSubmit: (value: string) => void;
  onSearchUpdate: (value: string) => void;
  onFilterUpdate: (newFilter: Filter) => void;
  onDrawerClose: () => void;
  onMenuClick: () => void;
  onLoadMore: () => void;
}

class SearchPageComponent extends React.Component<SearchPageProps, {}> {
  constructor(props) {
    super(props);
  }

  public render() {
    return (
      <div className={style.pageContainer}>
        <DrawerComponent
          className={style.drawerContainer}
          activeService={this.props.activeService}
          show={this.props.showDrawer}
          onClose={this.props.onDrawerClose}
        >
          <SearchComponent
            value={this.props.searchValue}
            onSearchSubmit={this.props.onSearchSubmit}
            onSearchUpdate={this.props.onSearchUpdate}
            suggestionCollection={this.props.suggestionCollection}
            resultCount={this.props.resultCount}
          />
          <FacetViewComponent
            facets={this.props.facetCollection}
            filters={this.props.filterCollection}
            onFilterUpdate={this.props.onFilterUpdate}
          />
        </DrawerComponent>
        <main className={style.mainContainer}>
          <PageBarComponent
            value={this.props.searchValue}
            onMenuClick={this.props.onMenuClick}
          />
          <ItemViewComponent
             items={this.props.itemCollection}
             loading={this.props.loading}
             onLoadMore={this.props.onLoadMore}
          />
        </main>
      </div>
    );
  }
}

export { SearchPageComponent };
