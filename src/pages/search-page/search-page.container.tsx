import * as React from "react";
import * as throttle from 'lodash.throttle';
import { SearchPageComponent } from "./search-page.component";
import { ViewState, FilterCollection, Filter } from "./view-model";
import { Service, StateReducer } from "./service";
import { serviceRegistry  } from "./service";
import { isArrayEmpty } from "../../util";


class SearchPageContainer extends React.Component<{}, ViewState> {
  constructor(props) {
    super(props);

    const initialservice = serviceRegistry.jfk;

    this.state = {
      searchValue: null,
      activeService: initialservice,
      itemCollection: null,
      facetCollection: null,
      filterCollection: null,
      suggestionCollection: null,
      resultCount: null,
      showDrawer: true, // TODO: Hide it by default.
      loading: false,
      pageSize: 10,
      pageIndex: null,
      // Override with user config initial state (if exists).
      ...initialservice.config.initialState
    };
  }

  
  // *** COMMON HELPERS ***

  private changeState = (key: keyof ViewState, value: any) => {
    this.setState({
      ...this.state,
      [key]: value,
    })
  }

  private changeLoadingState = (value: boolean) => {
    this.changeState("loading", value);
  }

  private informMessage = (message: string) => {
    // TODO: Snackbar implementation.
    console.log(message);
  }

  // *** DRAWER LOGIC ***

  private handleDrawerClose = () => {
    this.changeState("showDrawer", false);
  };

  private handleDrawerToggle = () => {
    this.changeState("showDrawer", !this.state.showDrawer);
  };

  private handleMenuClick = () => {
    this.handleDrawerToggle();
  };


  // *** SEARCH LOGIC ***

  private handleSearchSubmit = (newValue: string) => {
    // Run search but reset filters/suggestions intentionally.
    // No filters or suggestion list should appear when running a search.
    // TODO: BUG. Filters are not being reset actually. This behaviour around filters must be reworked.
    this.changeState("searchValue", newValue);
    this.runCleanSearch(newValue, null);
  }; 

  private runSearch = (value: string,
    pageIndex: number,
    filters: FilterCollection,
    successCallback: (stateReducer: StateReducer) => void,
    errorCallback: (rejectValue: any) => void) => {

    this.changeLoadingState(true);
    this.state.activeService
      .search({
        ...this.state,
        searchValue: value,
        filterCollection: filters,
        pageIndex,
      })
      .then(stateReducer => {
        successCallback(stateReducer);
      })
      .catch(rejectValue => {
        errorCallback(rejectValue);
      });
  }

  private runCleanSearch = (searchValue: string, filters: FilterCollection) => {
    this.runSearch(
      searchValue,
      0,  // Always search at page 0, clean search.
      filters,
      stateReducer => {
        const newState = stateReducer<ViewState>(this.state);
        this.setState({
          ...newState,
          loading: false,
          suggestionCollection: null,
          pageIndex: 0,
        });
      },
      rejectValue => {  
        this.informMessage(rejectValue);
        this.setState({
          ...this.state,
          loading: false,
          resultCount: null,
          itemCollection: null,          
          facetCollection: null,
          filterCollection: null,
          suggestionCollection: null,
          pageIndex: null,
        });
      }
    );
  }


  // *** FILTER LOGIC ***

  private handleFilterUpdate = (newFilter: Filter) => {
    const newFilterCollection = (this.state.filterCollection
      ? [...this.state.filterCollection.filter(f => f.fieldId !== newFilter.fieldId), newFilter]
      : [newFilter]).filter(f => f.store);
    this.changeState("filterCollection", newFilterCollection);
  };
  

  // *** PAGINATION LOGIC ***

  private handleLoadMore = () => {
    if (!this.state.loading) {
      this.runSearchForMore();
    }    
  }

  private reachedLastValidPageIndex = () => {
    // If resultCount info is available we can check whether we
    // are in the last valid page or note.
    if (this.state.resultCount !== null) {
      return this.getNextValidPageIndex() * this.state.pageSize >= this.state.resultCount;
    } else {
      // As we don't have enough information, we cannot grant
      // last page is reached.
      return false;
    }
  }

  private getNextValidPageIndex = () => {
    return this.state.pageIndex !== null ? this.state.pageIndex + 1 : 0;
  };
    
  private runSearchForMore = () => {
    if (!this.reachedLastValidPageIndex()) {
      const nextPageIndex = this.getNextValidPageIndex();
      this.runSearch(
        this.state.searchValue,
        nextPageIndex,
        this.state.filterCollection,
        stateReducer => {
          const newState = stateReducer<ViewState>(this.state);
          if (!isArrayEmpty(newState.itemCollection)) {
            this.setState({
              ...newState,
              loading: false,
              itemCollection: this.state.itemCollection.concat(newState.itemCollection),
              pageIndex: nextPageIndex,
            });            
          } else {
            this.changeLoadingState(false);
          }
        },
        rejectValue => {  
          this.informMessage(rejectValue);
          this.changeLoadingState(false);
        }
      );
    }    
  };


  // *** SUGGESTIONS LOGIC ***

  private handleSearchUpdate = (newValue: string) => {
    this.changeState("searchValue", newValue);
  };

  private runSuggestions = throttle(() => {
    this.state.activeService
      .suggest(this.state)
      .then(stateReducer => {
        const newState = stateReducer<ViewState>(this.state);
        this.changeState("suggestionCollection", newState.suggestionCollection);
      })
      .catch(rejectedValue => this.changeState("suggestionCollection", null));
  }, 250, {leading: true, trailing: true});
  

  // *** REACT LIFECYCLE ***

  public componentDidUpdate(prevProps, prevState) {
    if (this.state.filterCollection !== prevState.filterCollection) {
      this.runCleanSearch(this.state.searchValue, this.state.filterCollection);
    } else if (this.state.searchValue !== prevState.searchValue) {
      this.runSuggestions();
    }
  }

  public render() {
    return (
      <div>
        <SearchPageComponent
          activeService={this.state.activeService}
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
        />
      </div>
    );
  }
}

export { SearchPageContainer };
