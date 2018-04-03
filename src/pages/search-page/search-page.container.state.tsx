import { jfkService, StateReducer  } from "./service";
import { State, SuggestionCollection, FilterCollection, ResultViewMode } from "./view-model";

export const CreateInitialState = (): State => ({
  searchValue: null,
  resultViewMode: "grid",
  itemCollection: null,
  activeSearch: null,
  facetCollection: null,
  filterCollection: null,
  suggestionCollection: null,
  resultCount: null,
  showDrawer: true, // TODO: Hide it by default.
  pageSize: 10,
  pageIndex: 0,
  // Override with user config initial state (if exists).
  ...jfkService.config.initialState
});

export const searchValueUpdate = (searchValue: string) => (prevState: State): State => {
  return {
    ...prevState,
    searchValue,
  }
};

export const showDrawerUpdate = (showDrawer: boolean) => (prevState: State): State => {
  return {
    ...prevState,
    showDrawer,
  }
};

export const resultViewModeUpdate = (resultViewMode: ResultViewMode) => (prevState: State): State => {
  return {
    ...prevState,
    resultViewMode,
  }
};

export const receivedSearchValueUpdate = (searchValue: string, showDrawer: boolean, resultViewMode: ResultViewMode) =>
(prevState: State): State => {
  return {
    ...prevState,
    searchValue,
    showDrawer,
    resultViewMode,
  }
};

export const suggestionsUpdate = (suggestionCollection: SuggestionCollection) => (prevState: State): State => {
  return {
    ...prevState,
    suggestionCollection,
  }
};

export const preSearchUpdate = (filters: FilterCollection, pageIndex?: number) => (prevState: State) => {
  return {
    ...prevState,
    suggestionCollection: null,
    filterCollection: filters,
    pageIndex: pageIndex || 0,
  }
};

export const postSearchSuccessUpdate = (stateReducer: StateReducer) => (prevState: State): State => {
  return {
    ...stateReducer<State>(prevState),
    suggestionCollection: null,
    activeSearch: prevState.searchValue ? prevState.searchValue : null,
  }
};

export const postSearchMoreSuccessUpdate =  (stateReducer: StateReducer) => (prevState: State): State => {
  const reducedState = stateReducer<State>(prevState);
  return {
    ...reducedState,
    itemCollection: reducedState.itemCollection,
  }
};

export const postSearchErrorReset = (rejectValue) => (prevState: State): State => {
  console.debug(`Search Failed: ${rejectValue}`);
  return {
    ...prevState,
    resultCount: null,
    itemCollection: null,          
    facetCollection: null,
    filterCollection: null,
    suggestionCollection: null,
    pageIndex: 0,
    activeSearch: null,
  }
};

export const postSearchErrorKeep = (rejectValue) => (prevState: State): State => {
  console.debug(`Search Failed: ${rejectValue}`);
  return {
    ...prevState,
    suggestionCollection: null,
    pageIndex: prevState.pageIndex,
  };
}
