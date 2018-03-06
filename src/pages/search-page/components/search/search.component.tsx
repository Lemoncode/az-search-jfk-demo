import * as React from "react"
import Button from "material-ui/Button";
import Search from "material-ui-icons/Search";
import TextField from "material-ui/TextField";
import { AutocompleteInputComponent } from "./autocomplete.component";
import { SuggestionCollection } from "../../view-model";
import { cnc } from "../../../../util";
import Typography from "material-ui/Typography";

const style = require("./search.style.scss");


interface Search {
  value: string;
  onSearchSubmit: (value: string) => void;
  onSearchUpdate: (value: string) => void;
  resultCount?: number;
  suggestionCollection?: SuggestionCollection;
  className?: string;
}

const handleOnSearchUpdate = (props: Search) => (newValue: string) => {
  props.onSearchUpdate(newValue);
}

const handleOnSearchSubmit = (props: Search) => () => {
  props.onSearchSubmit(props.value);
}

const captureEnter = (props) => (e) => {
  if (e.key === "Enter") {
    props.onSearchSubmit(props.value);
  }
}

const SearchComponent: React.StatelessComponent<Search> = (props) => {
  return (
    <div className={cnc(props.className, style.container)}>
      <div className={style.controlContainer}>
        <AutocompleteInputComponent className={style.input}
          type="search"
          name="searchBox"
          id="searchBox"
          placeholder="Search ..."
          searchValue={props.value}
          suggestionCollection={props.suggestionCollection}
          onSearchUpdate={handleOnSearchUpdate(props)}
          onKeyPress={captureEnter(props)}
          autoFocus
        />
        <Button classes={{root: style.button}}
          variant="raised"
          size="small"
          color="secondary"
          onClick={handleOnSearchSubmit(props)}
        >
          <Search />
        </Button>
      </div>
      {
        props.resultCount !== null ?
          <div className={style.infoContainer}>
            <Typography variant="subheading"
              color={props.resultCount ? "primary" : "secondary"}
            >
              {`${props.resultCount} results found`}
            </Typography>
          </div>
        : null
      }        
    </div>
  );
}

export { SearchComponent };