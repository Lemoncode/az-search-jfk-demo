import * as React from "react";
import { SuggestionCollection, Suggestion } from "../../view-model";
import TextField, { TextFieldProps } from "material-ui/TextField";
import Paper from "material-ui/Paper";
import { cnc } from "../../../../util";
import { MenuItem } from "material-ui/Menu";
import Downshift from "downshift";

const style = require("./autocomplete.style.scss");


interface AutocompleteInput {
  type: string;
  name: string;
  id: string;
  searchValue: string;
  onSearchUpdate: (newValue: string) => void;
  onKeyPress?: (event) => void;
  suggestionCollection?: SuggestionCollection;
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
}

const renderInput = (params) => {
  const {innerInputProps, ...other} = params;
  return (
    <TextField
      {...other}
      classes={{root: style.input}}
      InputProps = {{
        ...innerInputProps
      }}
    />
  );
};

const renderSuggestionItem = (params) => {
  const {suggestion, index, composedProps, highlightedIndex, selectedItem} = params;
  const isHighlighted = highlightedIndex === index;
  const isSelected = selectedItem === suggestion.text;

  return (
    <MenuItem
      {...composedProps}
      key={index}
      selected={isHighlighted}
      component="div"
      classes={{ root: style.suggestionItem }}
    >
      {suggestion.text}
    </MenuItem>
  );
};

const renderSuggestionCollection = (params) => {
  const {suggestionCollection, getItemProps, isOpen, selectedItem, highlightedIndex} = params;
  if (isOpen && suggestionCollection && suggestionCollection.length) {
    return (
      <Paper square classes={{root: style.dropdownArea}}>
        {suggestionCollection.map((suggestion, index) =>
          renderSuggestionItem({
            suggestion,
            index,
            composedProps: getItemProps({
              item: suggestion.text,
              index: index,
            }),
            highlightedIndex,
            selectedItem,
          })
        )}
      </Paper>
    );
  } else {
    return null;
  }
};

const handleItemToString = item => (item ? item.toString() : "");

const AutocompleteInputComponent: React.StatelessComponent<AutocompleteInput> = props => {
  return (
    <Downshift      
      selectedItem={props.searchValue}
      onInputValueChange={newValue => props.onSearchUpdate(newValue)}
      itemToString={handleItemToString}
    >
      {({ getInputProps, getItemProps, isOpen, inputValue, selectedItem, highlightedIndex }) => {
        
        return (
          <div className={cnc(props.className, style.container)}>
            {renderInput({
              autoFocus: props.autoFocus,
              fullWidth: true,
              innerInputProps: getInputProps({
                type: props.type,
                name: props.name,
                id: props.id,
                placeholder: props.placeholder,
                onKeyDown: props.onKeyPress,
              }),            
            })}
            {renderSuggestionCollection({
              suggestionCollection: props.suggestionCollection,
              getItemProps,
              isOpen,
              selectedItem,
              highlightedIndex,
            })}
          </div>
        );
      }}
    </Downshift>
  );
};

export { AutocompleteInputComponent };