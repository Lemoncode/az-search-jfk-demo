import { Service } from "../service";
import { ItemCollection } from "./item.model";
import { FacetCollection } from "./facet.model";
import { FilterCollection } from "./filter.model";
import { SuggestionCollection } from "./suggestion.model";

export interface State {
  searchValue: string;
  itemCollection: ItemCollection;
  facetCollection: FacetCollection;
  filterCollection: FilterCollection;
  suggestionCollection: SuggestionCollection;
  resultCount: number;
  showDrawer: boolean;
  loading: boolean;
  pageSize: number;
  pageIndex: number;
  lastPageIndexReached: boolean;
}