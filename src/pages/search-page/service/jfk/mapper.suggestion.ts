import { isArrayEmpty } from "../../../../util";
import { ServiceConfig, MapperToPayload } from "../../service";
import { AzResponse, AzPayload } from "../../../../az-api";
import { Suggestion, ViewState } from "../../view-model";


// [Suggestion] FROM AzApi TO view model.

const mapSuggestionResponse = (suggestion: any): Suggestion => {
  return suggestion ? {
    text: suggestion.text,
  } : null;
};

export const mapSuggestionResponseToState = (state: ViewState, response: AzResponse, config: ServiceConfig): ViewState => {
  return {
    ...state,
    suggestionCollection: isArrayEmpty(response.value) ? null :
      response.value.map(s => mapSuggestionResponse(s)),
  }
};


// [Suggestion] FROM view model TO AzApi.

export const mapStateToSuggestionPayload = (state: ViewState, config: ServiceConfig): AzPayload => {
  return state.searchValue ? {
    ...config.suggestionConfig.defaultPayload,
    search: state.searchValue,
  } : null;
};
