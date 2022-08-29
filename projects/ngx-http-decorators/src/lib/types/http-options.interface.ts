import { HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { PathParams } from '../decorators/param.decorator';
import { HttpObserve } from './http-observe.enum';
import { HttpResponseType } from './http-response-type.enum';

export interface HttpOptions<
  TObserve extends HttpObserve = HttpObserve.BODY,
  TResponseType extends HttpResponseType = HttpResponseType.JSON
> {
  host?: string;
  pathPrefix?: string;
  headers?: HttpHeaders | { [header: string]: string | string[] };
  context?: HttpContext;
  observe?: TObserve;
  params?:
    | HttpParams
    | {
        [param: string]:
          | string
          | number
          | boolean
          | ReadonlyArray<string | number | boolean>;
      };
  pathParams?: PathParams;
  reportProgress?: boolean;
  responseType?: TResponseType;
  withCredentials?: boolean;
}
