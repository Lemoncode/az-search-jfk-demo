import * as React from "react";
import Divider from "material-ui/Divider";
import { PageBarComponent } from "./components/page-bar";
import { DrawerComponent } from "./components/drawer";
import { SearchComponent } from "./components/search";
import { ItemCollectionViewComponent } from "./components/item";
import { FacetViewComponent } from "./components/facets";
import { HorizontalSeparator } from "./../../common/components/horizontal-separator";
import { GraphViewComponent } from "./components/graph";
import { SpacerComponent } from "./components/spacer";
import {
  ItemCollection,
  FacetCollection,
  FilterCollection,
  Filter,
  SuggestionCollection,
  Item,
  ResultViewMode,
} from "./view-model";
import { Service } from "./service";
import { Pagination } from "../../common/components/pagination/pagination";

const style = require("./search-page.style.scss");


interface SearchPageProps {
  activeService: Service;
  showDrawer: boolean;
  resultViewMode: ResultViewMode;
  searchValue: string;
  itemCollection: ItemCollection;
  activeSearch?: string
  facetCollection: FacetCollection;
  filterCollection: FilterCollection;
  suggestionCollection?: SuggestionCollection;
  resultCount: number;
  resultsPerPage: number;
  pageIndex: number;
  onSearchSubmit: () => void;
  onSearchUpdate: (value: string) => void;
  onFilterUpdate: (newFilter: Filter) => void;
  onItemClick: (item: Item) => void;
  onDrawerClose: () => void;
  onMenuClick: () => void;
  onLoadMore: (pageIndex: number) => void;
  onChangeResultViewMode: (newMode: ResultViewMode) => void;
  onGraphNodeDblClick: (searchValue: string) => void;
}

const DrawerAreaComponent = (props: SearchPageProps) => (
  <DrawerComponent
    className={style.drawerContainer}
    activeService={props.activeService}
    show={props.showDrawer}
    onMenuClick={props.onMenuClick}
    onClose={props.onDrawerClose}
  >
    <SearchComponent
      value={props.searchValue}
      onSearchSubmit={props.onSearchSubmit}
      onSearchUpdate={props.onSearchUpdate}
      suggestionCollection={props.suggestionCollection}
      resultCount={props.resultCount}
    />
    <FacetViewComponent
      facets={props.facetCollection}
      filters={props.filterCollection}
      onFilterUpdate={props.onFilterUpdate}
    />
  </DrawerComponent>
);

class ResultAreaComponent extends React.PureComponent<Partial<SearchPageProps>> {
  private handlePageChange = (pageNum) => {
    this.props.onLoadMore(pageNum - 1);
  }
  
  render() {
    return (
      <SpacerComponent>
        {
          this.props.resultViewMode === "grid" ?
            <div>
            <ItemCollectionViewComponent
              items={this.props.itemCollection}
              activeSearch={this.props.activeSearch}
              onClick={this.props.onItemClick}
            />
            <Pagination
              activePage={this.props.pageIndex + 1}
              itemsCountPerPage={this.props.resultsPerPage}
              totalItemsCount={this.props.resultCount}
              pageRangeDisplayed={5}
              onChange={this.handlePageChange}
            />
            </div> :
            <GraphViewComponent
              searchValue={this.props.activeSearch}
              onGraphNodeDblClick={this.props.onGraphNodeDblClick}
            />
        }
      </SpacerComponent>
    );
  }
}

const SearchPageComponent = (props: SearchPageProps) => (
  <div className={style.pageContainer}>
    <DrawerAreaComponent {...props} />
    <main className={style.mainContainer}>
      <PageBarComponent
        resultViewMode={props.resultViewMode}
        onChangeResultViewMode={props.onChangeResultViewMode}
        onMenuClick={props.onMenuClick}
      />
      <HorizontalSeparator />
      <ResultAreaComponent
        itemCollection={props.itemCollection}
        activeSearch={props.activeSearch}
	pageIndex={props.pageIndex}
	resultsPerPage={props.resultsPerPage}
	resultCount={props.resultCount}
        onItemClick={props.onItemClick}
        onLoadMore={props.onLoadMore}
        onGraphNodeDblClick={props.onGraphNodeDblClick}
        resultViewMode={props.resultViewMode}
      />
    </main>
  </div>
)


export { SearchPageComponent };
