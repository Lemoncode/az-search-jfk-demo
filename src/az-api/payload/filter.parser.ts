import { AzFilterGroup, AzFilter, AzFilterCollection, AzFilterSingle } from "./filter.model";
import { isArrayEmpty, checkDuckType } from "../../util";
import { AzFilterGroupItem } from ".";

/**
 * Parsers for Filters.
 * A parser will do a transformation from Filter object to GET or POST query params.
 * TODO: Only core filtering has been implemented. The standard is wider. Check:
 * https://docs.microsoft.com/en-us/rest/api/searchservice/odata-expression-syntax-for-azure-search
 */


const checkSingleValueEqualityAgainstMultipleValues = (fieldName, operator, values) => {
  // Compare equality/not equality against multiple values.
  // Special case of search.in function for performance.
  return `${operator==="ne" ? "not " : ""}search.in(${fieldName},'${values.join("|")}', '|')`;
}

const parseFilterSingle = (f: AzFilterSingle): string => {
  if (f.value.length) {
    // Compare against multiple values.
    const values = f.value as string[];
    if ((f.operator === "eq" && (!f.logic || f.logic === "or")) || 
      (f.operator === "ne" && (!f.logic || f.logic === "and"))) {
      return checkSingleValueEqualityAgainstMultipleValues(f.fieldName, f.operator, values);      
    } else {
      return values.map(v => `${f.fieldName} ${f.operator} ${v}`).join(` ${f.logic} `);
    }
  } else {
    // Compare against single value.
    return `${f.fieldName} ${f.operator} ${f.value}`;
  }  
}

const parseFilterCollection = (f: AzFilterCollection): string => {
  return `${f.fieldName}/${f.mode}(x: ${parseFilterSingle({
    fieldName: "x",
    operator: f.operator,
    value: f.value,
    logic: f.logic,      
  })})`;
}

const reduceItemToExpression = (item: AzFilterGroupItem) => {
  if (checkDuckType(item as AzFilterGroup, "items" )) {
    return parseFilterGroup(item as AzFilterGroup);
  } else if (checkDuckType(item as AzFilterCollection, "mode" )){
    return parseFilterCollection(item as AzFilterCollection);
  } else {
    return parseFilterSingle(item as AzFilterSingle);
  }
}

export const parseFilterGroup = (fg: AzFilterGroup): string => {
  if (isArrayEmpty(fg.items)) return "";

  return `(${
    fg.items
      .map(reduceItemToExpression)
      .filter(expression => expression)
      .join(` ${fg.logic} `)
  })`;
};
