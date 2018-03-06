import { AzFilterGroup, AzFilter, AzFilterCollection, AzFilterSingle } from "./filter.model";
import { isArrayEmpty, checkDuckType } from "../../util";

/**
 * Parsers for Filters.
 * A parser will do a transformation from Filter object to GET or POST query params.
 * TODO: Only core filtering has been implemented. The standard is wider. Check:
 * https://docs.microsoft.com/en-us/rest/api/searchservice/odata-expression-syntax-for-azure-search
 */


const parseFilterSingle = (f: AzFilterSingle): string => {
  if (f.value.length) {
    // Compare against multiple values.
    const values = f.value as string[];
    if ((f.operator === "eq" && (!f.logic || f.logic === "or")) || 
      (f.operator === "ne" && (!f.logic || f.logic === "and"))) {
      // Compare equality/not equality against multiple values.
      // Special case of search.in function for performance.
      return `${f.operator==="ne" ? "not " : ""}search.in(${f.fieldName},'${values.join("|")}', '|')`;
    } else {
      // TODO: Is this case necessary? does it have any sense?
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

export const parseFilterGroup = (fg: AzFilterGroup): string => {
  if (isArrayEmpty(fg.items)) return "";

  return `(${
    fg.items.map(f => {
      if (checkDuckType(f as AzFilterGroup, "items" )) {
        return parseFilterGroup(f as AzFilterGroup);
      } else if (checkDuckType(f as AzFilterCollection, "mode" )){
        return parseFilterCollection(f as AzFilterCollection);
      } else {
        return parseFilterSingle(f as AzFilterSingle);
      }
    }).filter(f => f).join(` ${fg.logic} `)
  })`;
};
