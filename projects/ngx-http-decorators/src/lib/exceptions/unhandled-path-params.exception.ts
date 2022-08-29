import { Exception } from "./exception";

export class UnhandledPathParamException extends Exception {
  constructor(url: string, key: string) {
    super(`Path param with key "${key}" is not handled in the URL - "${url}".`);
    this.name = `UnhandledPathParamException: path param with key "${key}" is not handled in the URL - "${url}".`;
  }
}
