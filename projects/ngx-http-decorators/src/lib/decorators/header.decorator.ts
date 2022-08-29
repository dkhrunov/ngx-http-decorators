import 'reflect-metadata';
import { HeaderDecoratorNotSupportedException } from '../exceptions/header-decorator-not-supported.exception';
import { isString, isSymbol } from '../utils/common-type-guards.util';
import { extendObjectMetadata } from '../utils/extend-metadata.util';

const HEADERS_METADATA = Symbol('nhd-meta:headers');

export type Headers = { [header: string]: string };

/**
 * Request method and class Decorator. Sets a request header.
 *
 * If applied to a class, this header will be sent with all requests in that class.
 *
 * ----------------------
 *
 * For example:
 * `@Header('Cache-Control', 'none')`
 *
 * @see [HttpHeaders](https://angular.io/api/common/http/HttpHeaders)
 *
 * @publicApi
 */
export function Header(name: string, value: string) {
  return function (
    ...args: [any] | [any, string | symbol, TypedPropertyDescriptor<any>]
  ): any {
    switch (args.length) {
      // Class Decorator
      case 1:
        classHeader(name, value)(...args);
        break;

      // Method Decorator
      case 3:
        if (typeof args[2] === 'number') {
          throw new HeaderDecoratorNotSupportedException();
        }
        return methodHeader(name, value)(...args);

      default:
        throw new HeaderDecoratorNotSupportedException();
    }
  };
}

/**
 * Reflect request method and gets the request headers.
 */
export function getHeaders(
  target: Object,
  propertyKey?: string | symbol
): Headers | undefined {
  if (isString(propertyKey) || isSymbol(propertyKey)) {
    return Reflect.getOwnMetadata(HEADERS_METADATA, target, propertyKey);
  }

  return Reflect.getOwnMetadata(HEADERS_METADATA, target);
}

/**
 * Class Decorator. Sets a request header for all request in this class.
 *
 * ----------------------
 *
 * For example:
 * `@Header('Cache-Control', 'none')`
 *
 * @see [HttpHeaders](https://angular.io/api/common/http/HttpHeaders)
 *
 * @publicApi
 */
function classHeader(name: string, value: string): ClassDecorator {
  return (target: Function): void => {
    extendObjectMetadata(HEADERS_METADATA, { [name]: value }, target);
  };
}

/**
 * Request method Decorator. Sets a request header.
 *
 * ----------------------
 *
 * For example:
 * `@Header('Cache-Control', 'none')`
 *
 * @see [HttpHeaders](https://angular.io/api/common/http/HttpHeaders)
 *
 * @publicApi
 */
function methodHeader(name: string, value: string): MethodDecorator {
  return function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ): TypedPropertyDescriptor<any> {
    extendObjectMetadata(
      HEADERS_METADATA,
      { [name]: value },
      target,
      propertyKey
    );

    return descriptor;
  };
}
