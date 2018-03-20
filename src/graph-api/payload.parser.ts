import { GraphPayload } from "./payload.model";

/**
 * Parsers for Payload.
 * Very simple so far, segregated just in case query got more
 * complex in the future.
 */

export const parsePayload = (p: GraphPayload): string => {
  return [
    p.search ? `q=${p.search}` : "",
  ]
    .filter(i => i)
    .join("&");
};
