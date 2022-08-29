import { Exception } from "./exception";

export class EndpointNotSupportedException extends Exception {
  constructor(key?: string) {
    super(`Endpoint with key "${key}" is not supported.`);
    this.name = `EndpointNotSupportedException: endpoint with key "${key}" is not supported.`;
  }
}
