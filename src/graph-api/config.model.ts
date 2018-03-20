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

// TODO: [MOCK] Replace mocked default connection 
// settings with the real ones.

// export const defaultGraphConfig: GraphConfig = {
//   protocol: "https",
//   serviceName: "jfkfiles2",
//   serviceDomain: "azurewebsites.net",
//   servicePath: "api/data/GetFDNodes",
//   method: "GET",
// }

export const defaultGraphConfig: GraphConfig = {
  protocol: "https",
  serviceName: "www",
  serviceDomain: "mocky.io",
  servicePath: "v2/5ab11f2f2e0000ae1ee8b981",
  method: "GET",
}
