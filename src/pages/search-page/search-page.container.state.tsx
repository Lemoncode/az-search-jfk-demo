import { jfkService, StateReducer  } from "./service";
import { State, SuggestionCollection, FilterCollection } from "./view-model";

export const initialState: State = {
  searchValue: null,
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
  ...jfkService.config.initialState
};

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

export const suggestionsUpdate = (suggestionCollection: SuggestionCollection) => (prevState: State): State => {
  return {
    ...prevState,
    suggestionCollection,
  }
};

export const preSearchUpdate = (filters: FilterCollection, pageIndex?: number) => (prevState: State) => {
console.log("Search reset Suggestion");    
  return {
    ...prevState,
    loading: true,
    suggestionCollection: null,
    filterCollection: filters,
    pageIndex: pageIndex || 0,
  }
};

export const postSearchSuccessUpdate = (stateReducer: StateReducer) => (prevState: State): State => {
  return {
    ...stateReducer<State>(prevState),
    loading: false,
    suggestionCollection: null,
  }
};

export const postSearchSuccessAppend =  (stateReducer: StateReducer) => (prevState: State): State => {
  const reducedState = stateReducer<State>(prevState);
  return {
    ...reducedState,
    loading: false,
    itemCollection: prevState.itemCollection.concat(reducedState.itemCollection),
  }
};

export const postSearchErrorReset = (rejectValue) => (prevState: State): State => {
  console.debug(`Search Failed: ${rejectValue}`);
  return {
    ...prevState,
    loading: false,
    resultCount: null,
    itemCollection: null,          
    facetCollection: null,
    filterCollection: null,
    suggestionCollection: null,
    pageIndex: null,
  }
};

export const postSearchErrorKeep = (rejectValue) => (prevState: State): State => {
  console.debug(`Search Failed: ${rejectValue}`);
  return {
    ...prevState,
    loading: false,
    suggestionCollection: null,
    pageIndex: prevState.pageIndex ? prevState.pageIndex - 1 : null,
  };
}