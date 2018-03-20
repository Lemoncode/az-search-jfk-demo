import { GraphConfig } from "./config.model";
import { GraphPayload } from "./payload.model";
import { parsePayload } from "./payload.parser";
import { parseConfig } from "./config.parser";

/**
 * Given an API configuration and payload, it creates the Request object for the fetch method.
 */


export interface GraphRequest {
  url: string;
  options: RequestInit;
}

const buildURL = (config: GraphConfig, payload: GraphPayload): string => {
  return [
    parseConfig(config),
    parsePayload(payload),
  ].filter(i => i).join("");
};


export const CreateRequest = (config: GraphConfig, payload: GraphPayload): GraphRequest => ({
  url: buildURL(config, payload),
  options: {
    method: config.method,
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
  }
});
