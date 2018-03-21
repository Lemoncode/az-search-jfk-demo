/**
 * Object that represents API conection parameters.
 */

export interface GraphConfig {
  protocol: string;
  serviceName: string;
  serviceDomain: string;
  servicePath: string;
  method: "GET";
}

export const defaultGraphConfig: GraphConfig = {
  protocol: "https",
  serviceName: "jfkfiles2",
  serviceDomain: "azurewebsites.net",
  servicePath: "api/data/GetFDNodes",
  method: "GET",
}
