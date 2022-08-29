import { Observable } from 'rxjs';
import { BodyNotSupportedException } from '../exceptions/body-not-supported.exception';
import { NgxHttpDecoratorsModule } from '../ngx-http-decorators.module';
import { NhdHttpClient } from '../nhd-http-client.service';
import { DecoratedHttpRequestOptions } from '../types/decorated-http-request-options.interface';
import { HttpMethod } from '../types/http-method.enum';
import { HttpOptions } from '../types/http-options.interface';
import {
  defineMetadataInMethodContext,
  getMetadataFromMethodContext,
} from '../utils/method-context-metadata.util';
import { getBody, hasBody } from './body.decorator';
import { getContext } from './context.decorator';
import { getHost, getPathPrefix } from './controller.decorator';
import { getHeaders } from './header.decorator';
import { getPathParams } from './param.decorator';
import { getQueryParams } from './query.decorator';

const REQUEST_METADATA = Symbol('nhd-meta:request');

/**
 * Request (method) Decorator. Send HTTP request to the specified path.
 *
 * @publicApi
 */
export function Request<TResponse>(
  method: HttpMethod,
  path?: string,
  options?: DecoratedHttpRequestOptions
): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ): TypedPropertyDescriptor<any> {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]): Observable<TResponse> {
      const host = options?.host ?? getHost(target.constructor);
      const pathPrefix = getPathPrefix(target.constructor);

      if (method === HttpMethod.GET && hasBody(target, propertyKey)) {
        throw new BodyNotSupportedException(
          String(host) + String(path),
          method
        );
      }

      // TODO replace to inject(NhdHttpClient) after updating to Angular v14
      const http = NgxHttpDecoratorsModule.injector.get(NhdHttpClient);

      const headers = {
        // Class Header decorators
        ...getHeaders(target.constructor),
        // Current Method Header decorators
        ...getHeaders(target, propertyKey),
      };
      const body = getBody(target, propertyKey, args);
      const context = getContext(target, propertyKey);
      const params = getQueryParams(target, propertyKey, args);
      const pathParams = getPathParams(target, propertyKey, args);

      const httpRequest = http.request<TResponse>(method, path ?? '', body, {
        ...options,
        host,
        pathPrefix,
        params,
        headers,
        pathParams,
        context,
      });

      defineMetadataInMethodContext(
        REQUEST_METADATA,
        httpRequest,
        target,
        propertyKey
      );

      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

/**
 * Used to get a generated request based on metadata.
 *
 * ---------------------
 *
 * __Note:__
 * It is required to provide a reference to the method inside which this function is called.
 *
 * @publicApi
 */
export function request<T>(method: (...args: any[]) => any): Observable<T> {
  return getMetadataFromMethodContext(REQUEST_METADATA, method);
}

/**
 * Request (method) Decorator. Send HTTP GET request to the specified path.
 *
 * @publicApi
 */
export function Get<TResponse>(
  path?: string,
  options?: DecoratedHttpRequestOptions
): MethodDecorator {
  return Request<TResponse>(HttpMethod.GET, path, options);
}

/**
 * Request (method) Decorator. Send HTTP POST request to the specified path.
 *
 * @publicApi
 */
export function Post<TResponse>(
  path?: string,
  options?: DecoratedHttpRequestOptions
): MethodDecorator {
  return Request<TResponse>(HttpMethod.POST, path, options);
}

/**
 * Request (method) Decorator. Send HTTP PUT request to the specified path.
 *
 * @publicApi
 */
export function Put<TResponse>(
  path?: string,
  options?: DecoratedHttpRequestOptions
): MethodDecorator {
  return Request<TResponse>(HttpMethod.PUT, path, options);
}

/**
 * Request (method) Decorator. Send HTTP PATCH request to the specified path.
 *
 * @publicApi
 */
export function Patch<TResponse>(
  path?: string,
  options?: DecoratedHttpRequestOptions
): MethodDecorator {
  return Request<TResponse>(HttpMethod.PATCH, path, options);
}

/**
 * Request (method) Decorator. Send HTTP DELETE request to the specified path.
 *
 * @publicApi
 */
export function Delete<TResponse>(
  path?: string,
  options?: HttpOptions
): MethodDecorator {
  return Request<TResponse>(HttpMethod.DELETE, path, options);
}
