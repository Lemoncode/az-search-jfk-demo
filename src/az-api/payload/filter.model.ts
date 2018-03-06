/**
 * Types for Filters.
 */


export interface AzFilterSingle {
  fieldName: string;
  operator: "eq" | "ne" | "gt" | "lt" | "ge" | "le";
  value: string | string[];
  logic?: "and" | "or"; // Only applicable to multiple values.
}

export interface AzFilterCollection {
  fieldName: string;
  mode: "any" | "all";
  operator: "eq" | "ne";
  value: string | string[];
  logic?: "and" | "or";
}

export type AzFilter = AzFilterSingle | AzFilterCollection;

export interface AzFilterGroup {
  items: (AzFilter | AzFilterGroup)[];
  logic: "and" | "or";
}