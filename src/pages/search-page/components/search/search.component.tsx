import * as React from "react"
import Button from "material-ui/Button";
import Search from "material-ui-icons/Search";
import TextField from "material-ui/TextField";
import { AutocompleteInputComponent } from "./autocomplete.component";
import { SuggestionCollection } from "../../view-model";
import { cnc } from "../../../../util";
import Typography from "material-ui/Typography";

const style = require("./search.style.scss");


interface SearchProps {
  value: string;
  onSearchSubmit: () => void;
  onSearchUpdate: (value: string) => void;
  resultCount?: number;
  suggestionCollection?: SuggestionCollection;
  className?: string;
}

const captureEnter = (props) => (event => {
  if (event.key === "Enter") {
    props.onSearchSubmit();
  }
});

const SearchAutocompleteInput = ({searchValue, suggestionCollection, onSearchUpdate, onKeyPress}) => (
  <AutocompleteInputComponent className={style.input}
    type="search"
    name="searchBox"
    id="searchBox"
    placeholder="Search ..."
    searchValue={searchValue}
    suggestionCollection={suggestionCollection}
    onSearchUpdate={onSearchUpdate}
    onKeyPress={onKeyPress}
    autoFocus
  />
);

const SearchButton = ({ onClick }) => (
  <Button classes={{root: style.button}}
    variant="raised"
    size="small"
    color="secondary"
    onClick={onClick}
  >
    <Search />
  </Button>
);

const ResultCounter = ({ count }) => (
  <Typography variant="subheading"
    color={count ? "primary" : "secondary"}
  >
    {`${count} results found`}
  </Typography>
);

const SearchComponent: React.StatelessComponent<SearchProps> = (props) => {
  return (
    <div className={cnc(props.className, style.container)}>
      <div className={style.controlContainer}>
        <SearchAutocompleteInput 
          searchValue={props.value}
          suggestionCollection={props.suggestionCollection}
          onSearchUpdate={props.onSearchUpdate}
          onKeyPress={captureEnter(props)}
        />
        <SearchButton onClick={props.onSearchSubmit} />
      </div>
      {
        props.resultCount !== null ?
          <div className={style.infoContainer}>
            <ResultCounter count={props.resultCount} />  
          </div>
        : null
      }        
    </div>
  );
}

export { SearchComponent };