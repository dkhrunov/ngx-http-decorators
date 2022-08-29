import { HttpMethod } from '../types/http-method.enum';
import { Exception } from './exception';

export class BodyNotSupportedException extends Exception {
  constructor(path: string, method: HttpMethod) {
    super(
      `Endpoint "${path}" is an HTTP ${method} request, the body is not supported for this type of request.`
    );
    this.name = `BodyNotSupportedException: endpoint "${path}" is an HTTP ${method} request, the body is not supported for this type of request.`;
  }
}
