import { HttpClient, HttpEvent, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UnhandledPathParamException } from './exceptions/unhandled-path-params.exception';
import { NGX_HTTP_DECORATORS_HOST_URL } from './injection-tokens';
import { HttpMethod } from './types/http-method.enum';
import { HttpObserve } from './types/http-observe.enum';
import { HttpOptions } from './types/http-options.interface';
import { HttpResponseType } from './types/http-response-type.enum';
import { isNil } from './utils/common-type-guards.util';
import { PATH_PARAM_REGEXP } from './utils/path-param.regexp';

@Injectable()
export class NhdHttpClient {
  constructor(
    private readonly _http: HttpClient,
    @Inject(NGX_HTTP_DECORATORS_HOST_URL) private readonly _host: string
  ) {}

  public request(
    httpMethod: HttpMethod,
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.EVENTS, HttpResponseType.ARRAY_BUFFER>
  ): Observable<HttpEvent<ArrayBuffer>>;

  public request(
    httpMethod: HttpMethod,
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.EVENTS, HttpResponseType.BLOB>
  ): Observable<HttpEvent<Blob>>;

  public request(
    httpMethod: HttpMethod,
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.EVENTS, HttpResponseType.TEXT>
  ): Observable<HttpEvent<string>>;

  public request(
    httpMethod: HttpMethod,
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.EVENTS, HttpResponseType.JSON>
  ): Observable<HttpEvent<any>>;

  public request<R>(
    httpMethod: HttpMethod,
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.EVENTS, HttpResponseType.JSON>
  ): Observable<HttpEvent<R>>;

  public request(
    httpMethod: HttpMethod,
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.RESPONSE, HttpResponseType.ARRAY_BUFFER>
  ): Observable<HttpResponse<ArrayBuffer>>;

  public request(
    httpMethod: HttpMethod,
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.RESPONSE, HttpResponseType.BLOB>
  ): Observable<HttpResponse<Blob>>;

  public request(
    httpMethod: HttpMethod,
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.RESPONSE, HttpResponseType.TEXT>
  ): Observable<HttpResponse<string>>;

  public request(
    httpMethod: HttpMethod,
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.RESPONSE, HttpResponseType.JSON>
  ): Observable<HttpResponse<Object>>;

  public request<R>(
    httpMethod: HttpMethod,
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.RESPONSE, HttpResponseType.JSON>
  ): Observable<HttpResponse<R>>;

  public request(
    httpMethod: HttpMethod,
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.BODY, HttpResponseType.ARRAY_BUFFER>
  ): Observable<ArrayBuffer>;

  public request(
    httpMethod: HttpMethod,
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.BODY, HttpResponseType.BLOB>
  ): Observable<Blob>;

  public request(
    httpMethod: HttpMethod,
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.BODY, HttpResponseType.TEXT>
  ): Observable<string>;

  public request(
    httpMethod: HttpMethod,
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.BODY, HttpResponseType.JSON>
  ): Observable<Object>;

  public request<R>(
    httpMethod: HttpMethod,
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.BODY, HttpResponseType.JSON>
  ): Observable<R>;

  public request(
    httpMethod: HttpMethod,
    path: string,
    body?: any,
    options?: HttpOptions<
      HttpObserve.BODY | HttpObserve.EVENTS | HttpObserve.RESPONSE,
      | HttpResponseType.ARRAY_BUFFER
      | HttpResponseType.BLOB
      | HttpResponseType.JSON
      | HttpResponseType.TEXT
    >
  ): Observable<any> {
    return this._http.request(httpMethod, this._formatPath(path, options), {
      ...options,
      body,
    });
  }

  public get(
    path: string,
    options?: HttpOptions<HttpObserve.BODY, HttpResponseType.JSON>
  ): Observable<Object>;

  public get<R>(
    path: string,
    options?: HttpOptions<HttpObserve.BODY, HttpResponseType.JSON>
  ): Observable<R>;

  public get(
    path: string,
    options?: HttpOptions<HttpObserve.BODY, HttpResponseType.ARRAY_BUFFER>
  ): Observable<ArrayBuffer>;

  public get(
    path: string,
    options?: HttpOptions<HttpObserve.BODY, HttpResponseType.BLOB>
  ): Observable<Blob>;

  public get(
    path: string,
    options?: HttpOptions<HttpObserve.BODY, HttpResponseType.TEXT>
  ): Observable<string>;

  public get(
    path: string,
    options?: HttpOptions<HttpObserve.EVENTS, HttpResponseType.ARRAY_BUFFER>
  ): Observable<HttpEvent<ArrayBuffer>>;

  public get(
    path: string,
    options?: HttpOptions<HttpObserve.EVENTS, HttpResponseType.BLOB>
  ): Observable<HttpEvent<Blob>>;

  public get(
    path: string,
    options?: HttpOptions<HttpObserve.EVENTS, HttpResponseType.TEXT>
  ): Observable<HttpEvent<string>>;
  public get(
    path: string,
    options?: HttpOptions<HttpObserve.EVENTS, HttpResponseType.JSON>
  ): Observable<HttpEvent<any>>;

  public get<R>(
    path: string,
    options?: HttpOptions<HttpObserve.EVENTS, HttpResponseType.JSON>
  ): Observable<HttpEvent<R>>;

  public get(
    path: string,
    options?: HttpOptions<HttpObserve.RESPONSE, HttpResponseType.ARRAY_BUFFER>
  ): Observable<HttpResponse<ArrayBuffer>>;

  public get(
    path: string,
    options?: HttpOptions<HttpObserve.RESPONSE, HttpResponseType.BLOB>
  ): Observable<HttpResponse<Blob>>;

  public get(
    path: string,
    options?: HttpOptions<HttpObserve.RESPONSE, HttpResponseType.TEXT>
  ): Observable<HttpResponse<string>>;

  public get(
    path: string,
    options?: HttpOptions<HttpObserve.RESPONSE, HttpResponseType.JSON>
  ): Observable<HttpResponse<Object>>;

  public get<R>(
    path: string,
    options?: HttpOptions<HttpObserve.RESPONSE, HttpResponseType.JSON>
  ): Observable<HttpResponse<R>>;

  public get(
    path: string,
    options?: HttpOptions<
      HttpObserve.BODY | HttpObserve.EVENTS | HttpObserve.RESPONSE,
      | HttpResponseType.ARRAY_BUFFER
      | HttpResponseType.BLOB
      | HttpResponseType.JSON
      | HttpResponseType.TEXT
    >
  ): Observable<any> {
    return this._http.request(
      HttpMethod.GET,
      this._formatPath(path, options),
      options
    );
  }

  public post(
    path: string,
    body?: any | null,
    options?: HttpOptions<HttpObserve.BODY, HttpResponseType.JSON>
  ): Observable<any>;

  public post<R>(
    path: string,
    body?: any | null,
    options?: HttpOptions<HttpObserve.BODY, HttpResponseType.JSON>
  ): Observable<R>;

  public post(
    path: string,
    body?: any | null,
    options?: HttpOptions<HttpObserve.BODY, HttpResponseType.ARRAY_BUFFER>
  ): Observable<ArrayBuffer>;

  public post(
    path: string,
    body?: any | null,
    options?: HttpOptions<HttpObserve.BODY, HttpResponseType.BLOB>
  ): Observable<Blob>;

  public post(
    path: string,
    body?: any | null,
    options?: HttpOptions<HttpObserve.BODY, HttpResponseType.TEXT>
  ): Observable<string>;

  public post(
    path: string,
    body?: any | null,
    options?: HttpOptions<HttpObserve.EVENTS, HttpResponseType.ARRAY_BUFFER>
  ): Observable<HttpEvent<ArrayBuffer>>;

  public post(
    path: string,
    body?: any | null,
    options?: HttpOptions<HttpObserve.EVENTS, HttpResponseType.BLOB>
  ): Observable<HttpEvent<Blob>>;

  public post(
    path: string,
    body?: any | null,
    options?: HttpOptions<HttpObserve.EVENTS, HttpResponseType.TEXT>
  ): Observable<HttpEvent<string>>;
  public post(
    path: string,
    body?: any | null,
    options?: HttpOptions<HttpObserve.EVENTS, HttpResponseType.JSON>
  ): Observable<HttpEvent<Object>>;

  public post<R>(
    path: string,
    body?: any | null,
    options?: HttpOptions<HttpObserve.EVENTS, HttpResponseType.JSON>
  ): Observable<HttpEvent<R>>;

  public post(
    path: string,
    body?: any | null,
    options?: HttpOptions<HttpObserve.RESPONSE, HttpResponseType.ARRAY_BUFFER>
  ): Observable<HttpResponse<ArrayBuffer>>;

  public post(
    path: string,
    body?: any | null,
    options?: HttpOptions<HttpObserve.RESPONSE, HttpResponseType.BLOB>
  ): Observable<HttpResponse<Blob>>;

  public post(
    path: string,
    body?: any | null,
    options?: HttpOptions<HttpObserve.RESPONSE, HttpResponseType.TEXT>
  ): Observable<HttpResponse<string>>;

  public post(
    path: string,
    body?: any | null,
    options?: HttpOptions<HttpObserve.RESPONSE, HttpResponseType.JSON>
  ): Observable<HttpResponse<Object>>;

  public post<R>(
    path: string,
    body?: any | null,
    options?: HttpOptions<HttpObserve.RESPONSE, HttpResponseType.JSON>
  ): Observable<HttpResponse<R>>;

  public post(
    path: string,
    body?: any | null,
    options?: HttpOptions<
      HttpObserve.BODY | HttpObserve.EVENTS | HttpObserve.RESPONSE,
      | HttpResponseType.ARRAY_BUFFER
      | HttpResponseType.BLOB
      | HttpResponseType.JSON
      | HttpResponseType.TEXT
    >
  ): Observable<any> {
    return this._http.request(
      HttpMethod.POST,
      this._formatPath(path, options),
      {
        ...options,
        body: body ?? null,
      }
    );
  }

  public put(
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.BODY, HttpResponseType.JSON>
  ): Observable<Object>;

  public put<R>(
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.BODY, HttpResponseType.JSON>
  ): Observable<R>;

  public put(
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.BODY, HttpResponseType.ARRAY_BUFFER>
  ): Observable<ArrayBuffer>;

  public put(
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.BODY, HttpResponseType.BLOB>
  ): Observable<Blob>;

  public put(
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.BODY, HttpResponseType.TEXT>
  ): Observable<string>;

  public put(
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.EVENTS, HttpResponseType.ARRAY_BUFFER>
  ): Observable<HttpEvent<ArrayBuffer>>;

  public put(
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.EVENTS, HttpResponseType.BLOB>
  ): Observable<HttpEvent<Blob>>;

  public put(
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.EVENTS, HttpResponseType.TEXT>
  ): Observable<HttpEvent<string>>;
  public put(
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.EVENTS, HttpResponseType.JSON>
  ): Observable<HttpEvent<any>>;

  public put<R>(
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.EVENTS, HttpResponseType.JSON>
  ): Observable<HttpEvent<R>>;

  public put(
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.RESPONSE, HttpResponseType.ARRAY_BUFFER>
  ): Observable<HttpResponse<ArrayBuffer>>;

  public put(
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.RESPONSE, HttpResponseType.BLOB>
  ): Observable<HttpResponse<Blob>>;

  public put(
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.RESPONSE, HttpResponseType.TEXT>
  ): Observable<HttpResponse<string>>;

  public put(
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.RESPONSE, HttpResponseType.JSON>
  ): Observable<HttpResponse<Object>>;

  public put<R>(
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.RESPONSE, HttpResponseType.JSON>
  ): Observable<HttpResponse<R>>;

  public put(
    path: string,
    body?: any,
    options?: HttpOptions<
      HttpObserve.BODY | HttpObserve.EVENTS | HttpObserve.RESPONSE,
      | HttpResponseType.ARRAY_BUFFER
      | HttpResponseType.BLOB
      | HttpResponseType.JSON
      | HttpResponseType.TEXT
    >
  ): Observable<any> {
    return this._http.request(HttpMethod.PUT, this._formatPath(path, options), {
      ...options,
      body,
    });
  }

  public patch(
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.BODY, HttpResponseType.JSON>
  ): Observable<Object>;

  public patch<R>(
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.BODY, HttpResponseType.JSON>
  ): Observable<R>;

  public patch(
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.BODY, HttpResponseType.ARRAY_BUFFER>
  ): Observable<ArrayBuffer>;

  public patch(
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.BODY, HttpResponseType.BLOB>
  ): Observable<Blob>;

  public patch(
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.BODY, HttpResponseType.TEXT>
  ): Observable<string>;

  public patch(
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.EVENTS, HttpResponseType.ARRAY_BUFFER>
  ): Observable<HttpEvent<ArrayBuffer>>;

  public patch(
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.EVENTS, HttpResponseType.BLOB>
  ): Observable<HttpEvent<Blob>>;

  public patch(
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.EVENTS, HttpResponseType.TEXT>
  ): Observable<HttpEvent<string>>;
  public patch(
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.EVENTS, HttpResponseType.JSON>
  ): Observable<HttpEvent<any>>;

  public patch<R>(
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.EVENTS, HttpResponseType.JSON>
  ): Observable<HttpEvent<R>>;

  public patch(
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.RESPONSE, HttpResponseType.ARRAY_BUFFER>
  ): Observable<HttpResponse<ArrayBuffer>>;

  public patch(
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.RESPONSE, HttpResponseType.BLOB>
  ): Observable<HttpResponse<Blob>>;

  public patch(
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.RESPONSE, HttpResponseType.TEXT>
  ): Observable<HttpResponse<string>>;

  public patch(
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.RESPONSE, HttpResponseType.JSON>
  ): Observable<HttpResponse<Object>>;

  public patch<R>(
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.RESPONSE, HttpResponseType.JSON>
  ): Observable<HttpResponse<R>>;

  public patch(
    path: string,
    body?: any,
    options?: HttpOptions<
      HttpObserve.BODY | HttpObserve.EVENTS | HttpObserve.RESPONSE,
      | HttpResponseType.ARRAY_BUFFER
      | HttpResponseType.BLOB
      | HttpResponseType.JSON
      | HttpResponseType.TEXT
    >
  ): Observable<any> {
    return this._http.request(
      HttpMethod.PATCH,
      this._formatPath(path, options),
      {
        ...options,
        body,
      }
    );
  }

  public delete(
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.BODY, HttpResponseType.JSON>
  ): Observable<Object>;

  public delete<R>(
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.BODY, HttpResponseType.JSON>
  ): Observable<R>;

  public delete(
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.BODY, HttpResponseType.ARRAY_BUFFER>
  ): Observable<ArrayBuffer>;

  public delete(
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.BODY, HttpResponseType.BLOB>
  ): Observable<Blob>;

  public delete(
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.BODY, HttpResponseType.TEXT>
  ): Observable<string>;

  public delete(
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.EVENTS, HttpResponseType.ARRAY_BUFFER>
  ): Observable<HttpEvent<ArrayBuffer>>;

  public delete(
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.EVENTS, HttpResponseType.BLOB>
  ): Observable<HttpEvent<Blob>>;

  public delete(
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.EVENTS, HttpResponseType.TEXT>
  ): Observable<HttpEvent<string>>;
  public delete(
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.EVENTS, HttpResponseType.JSON>
  ): Observable<HttpEvent<any>>;

  public delete<R>(
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.EVENTS, HttpResponseType.JSON>
  ): Observable<HttpEvent<R>>;

  public delete(
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.RESPONSE, HttpResponseType.ARRAY_BUFFER>
  ): Observable<HttpResponse<ArrayBuffer>>;

  public delete(
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.RESPONSE, HttpResponseType.BLOB>
  ): Observable<HttpResponse<Blob>>;

  public delete(
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.RESPONSE, HttpResponseType.TEXT>
  ): Observable<HttpResponse<string>>;

  public delete(
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.RESPONSE, HttpResponseType.JSON>
  ): Observable<HttpResponse<Object>>;

  public delete<R>(
    path: string,
    body?: any,
    options?: HttpOptions<HttpObserve.RESPONSE, HttpResponseType.JSON>
  ): Observable<HttpResponse<R>>;

  public delete(
    path: string,
    body?: any,
    options?: HttpOptions<
      HttpObserve.BODY | HttpObserve.EVENTS | HttpObserve.RESPONSE,
      | HttpResponseType.ARRAY_BUFFER
      | HttpResponseType.BLOB
      | HttpResponseType.JSON
      | HttpResponseType.TEXT
    >
  ): Observable<any> {
    return this._http.request(
      HttpMethod.DELETE,
      this._formatPath(path, options),
      {
        ...options,
        body,
      }
    );
  }

  private _formatPath(
    path: string,
    options?: Pick<HttpOptions, 'host' | 'pathPrefix' | 'pathParams'>
  ): string {
    const host = options?.host ?? this._host;
    const pathWithParams = this._replacePathParams(
      path,
      options?.pathParams ?? {}
    );
    const formatedPath = [options?.pathPrefix, pathWithParams].join('');

    return host + formatedPath;
  }

  private _replacePathParams(
    url: string,
    params: { [param: string]: string | number }
  ): string {
    return url.replace(PATH_PARAM_REGEXP, (m) => {
      const key = m.slice(-1) === '/' ? m.slice(2, -1) : m.slice(2);

      if (isNil(params[key])) {
        throw new UnhandledPathParamException(url, key);
      }

      return '/' + params[key];
    });
  }
}
