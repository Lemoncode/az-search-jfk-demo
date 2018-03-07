import * as React from "react";
import * as throttle from 'lodash.throttle';
import { SearchPageComponent } from "./search-page.component";
import { State, FilterCollection, Filter } from "./view-model";
import { Service, StateReducer } from "./service";
import { jfkService  } from "./service";
import { isArrayEmpty } from "../../util";
import {
  CreateInitialState,
  searchValueUpdate,
  showDrawerUpdate,
  suggestionsUpdate,
  preSearchUpdate,
  postSearchSuccessUpdate,
  postSearchSuccessAppend,
  postSearchErrorReset,
  postSearchErrorKeep,
  lastPageIndexReachedUpdate,
} from "./search-page.container.state";


class SearchPageContainer extends React.Component<{}, State> {
  constructor(props) {
    super(props);

    this.state = CreateInitialState();
  }

  // *** DRAWER LOGIC ***

  private handleDrawerClose = () => {
    this.setState(showDrawerUpdate(false));
  };

  private handleDrawerToggle = () => {
    this.setState(showDrawerUpdate(!this.state.showDrawer));
  };

  private handleMenuClick = () => {
    this.handleDrawerToggle();
  };


  // *** SEARCH LOGIC ***

  private handleSearchSubmit = () => {
    this.setState(
      preSearchUpdate(null),
      this.runSearch(postSearchSuccessUpdate, postSearchErrorReset)
    );
  }; 

  private runSearch = (
    successCallback: (stateReducer: StateReducer) => (prevState: State) => State,
    errorCallback: (rejectValue) => (prevState: State) => State
  ) => () => {
    jfkService
      .search(this.state)
      .then(stateReducer => this.setState(successCallback(stateReducer)))
      .catch(rejectValue => this.setState(errorCallback(rejectValue)));
  }


  // *** FILTER LOGIC ***

  private updateFilterCollection = (newFilter: Filter) => {
    return (
      this.state.filterCollection ?
        [...this.state.filterCollection.filter(f => f.fieldId !== newFilter.fieldId), newFilter]
        : [newFilter])
    .filter(f => f.store);
  }

  private handleFilterUpdate = (newFilter: Filter) => {
    const newFilterCollection = this.updateFilterCollection(newFilter);
    this.setState(
      preSearchUpdate(newFilterCollection),
      this.runSearch(postSearchSuccessUpdate, postSearchErrorReset)
    );
  };
  

  // *** PAGINATION LOGIC ***

  private reachedLastValidPageIndex = () => {
    if (this.state.resultCount !== null) {
      return this.getNextValidPageIndex() * this.state.pageSize >= this.state.resultCount;
    } else {
      return false;
    }
  }

  private getNextValidPageIndex = () => {
    return this.state.pageIndex === null ? 0 : this.state.pageIndex + 1;
  };

  private handleLoadMore = () => {
    if (this.state.loading) {
      return;
    } else if (this.reachedLastValidPageIndex()) {
      this.informMessage("No More Results Available");
      this.setState(lastPageIndexReachedUpdate(true));
      return;
    }

    this.setState(
      preSearchUpdate(this.state.filterCollection, this.getNextValidPageIndex()),
      this.runSearch(postSearchSuccessAppend, postSearchErrorKeep)
    );
  }


  // *** SUGGESTIONS LOGIC ***

  private handleSearchUpdate = (newValue: string) => {
    this.setState(searchValueUpdate(newValue), this.runSuggestions);
  };

  private runSuggestions = throttle(() => {
    jfkService
      .suggest(this.state)
      .then(stateReducer => this.setState(stateReducer<State>(this.state)))
      .catch(rejectValue => {
        console.debug(`Suggestions halted: ${rejectValue}`);
        this.setState(suggestionsUpdate(null));
      });
  }, 250, {leading: true, trailing: true});
  

  // TODO: Snackbar implementation.
  private informMessage = (message: string) => {
    console.log(message);
  }

  // *** REACT LIFECYCLE ***

  public render() {
    return (
      <div>
        <SearchPageComponent
          activeService={jfkService}
          searchValue={this.state.searchValue}
          suggestionCollection={this.state.suggestionCollection}
          onSearchUpdate={this.handleSearchUpdate}
          onSearchSubmit={this.handleSearchSubmit}
          filterCollection={this.state.filterCollection}
          onFilterUpdate={this.handleFilterUpdate}
          itemCollection={this.state.itemCollection}
          resultCount={this.state.resultCount}
          facetCollection={this.state.facetCollection}
          onMenuClick={this.handleMenuClick}
          showDrawer={this.state.showDrawer}
          onDrawerClose={this.handleDrawerClose}
          loading={this.state.loading}
          onLoadMore={this.handleLoadMore}
          noMoreResults={this.state.lastPageIndexReached}
        />
      </div>
    );
  }
}

export { SearchPageContainer };
