import * as React from "react";
import { PageBarComponent } from "./components/pageBar";
import { DrawerComponent } from "./components/drawer";
import { SearchComponent } from "./components/search";
import { ItemCollectionViewComponent } from "./components/item";
import { FacetViewComponent } from "./components/facets";
import {
  ItemCollection,
  FacetCollection,
  FilterCollection,
  Filter,
  SuggestionCollection,
  Item,
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
  noMoreResults: boolean;
  onSearchSubmit: () => void;
  onSearchUpdate: (value: string) => void;
  onFilterUpdate: (newFilter: Filter) => void;
  onItemClick: (item: Item) => void;
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
          <ItemCollectionViewComponent
             items={this.props.itemCollection}
             searchValue={this.props.searchValue}
             onClick={this.props.onItemClick}
             loading={this.props.loading}
             onLoadMore={this.props.onLoadMore}
             noMoreResults={this.props.noMoreResults}
          />
        </main>
      </div>
    );
  }
}

export { SearchPageComponent };
