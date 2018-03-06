import { Service, CreateService } from "../service";
import { jfkServiceConfig } from "./jfk";

export const serviceRegistry = {
  jfk: CreateService(jfkServiceConfig),
};
