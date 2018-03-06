import { defaultAzPayload } from "../../../../az-api";
import { ServiceConfig } from "../../service";
import { mapStateToSuggestionPayload, mapSuggestionResponseToState } from "./mapper.suggestion";
import { mapStateToSearchPayload, mapSearchResponseToState } from "./mapper.search";


export const jfkServiceConfig: ServiceConfig = {
  serviceId: "jfk-files",
  serviceName: "JFK Files",
  serviceIcon: "fingerprint",
  
  searchConfig: {
    apiConfig: {
      protocol: "https",
      serviceName: "jfk-files",
      serviceDomain: "search.windows.net",
      servicePath: "indexes/jfkdocs/docs",
      apiVer: "2017-11-11",
      apiKey: "263B733973D2050A214AF930AFD36D60",
      method: "GET",
    },
    defaultPayload: defaultAzPayload,
    mapStateToPayload: mapStateToSearchPayload,
    mapResponseToState: mapSearchResponseToState,
  },

  suggestionConfig: {
    apiConfig: {
      protocol: "https",
      serviceName: "jfk-files",
      serviceDomain: "search.windows.net",
      servicePath: "indexes/jfk/docs/autocomplete",
      apiVer: "2017-11-11-Preview",
      apiKey: "263B733973D2050A214AF930AFD36D60",
      method: "GET",
    },
    defaultPayload: {
      ...defaultAzPayload,
      count: false,
      top: 15,
      suggesterName: "sg-jfk",
      //autocompleteMode: "twoTerms",
    },
    mapStateToPayload: mapStateToSuggestionPayload,
    mapResponseToState: mapSuggestionResponseToState,
  },

  initialState: {
    facetCollection: [
      {
        fieldId: "tags",
        displayName: "Tags",
        iconName: "work",
        selectionControl: "checkboxList",
        maxCount: 20,
        values: null,
      },
    ]
  }  
}
