import { HttpContext, HttpContextToken } from '@angular/common/http';
import { isNil } from '../utils/common-type-guards.util';

const CONTEXT_METADATA = Symbol('nhd-meta:context');


// TODO сделать как Header декоратор, 
// чтобы можно было указывать как для класса, так и для метода

/**
 * Request method Decorator. Sets a request context.
 *
 * Specifies the `HttpContext` for the request. `HttpContext` is used to
 * store additional metadata that can be accessed from HTTP Interceptors.
 *
 * ----------------------
 *
 * For example:
 * ```typescript
 * \@Context(contextToken, 'value')
 * public getPosts(): Observable<Post[]> {}
 * ```
 *
 * @see [HttpContext](https://angular.io/api/common/http/HttpContext)
 *
 * @publicApi
 */
export function Context<T>(
  contextToken: HttpContextToken<T>,
  value: T
): MethodDecorator {
  return function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ): TypedPropertyDescriptor<any> {
    const existingContext = getContext(target, propertyKey);

    if (isNil(existingContext)) {
      Reflect.defineMetadata(
        CONTEXT_METADATA,
        new HttpContext().set(contextToken, value),
        target,
        propertyKey
      );
    } else {
      Reflect.defineMetadata(
        CONTEXT_METADATA,
        existingContext.set(contextToken, value),
        target,
        propertyKey
      );
    }

    return descriptor;
  };
}

/**
 * Reflect request method and gets the request context.
 */
export function getContext(
  target: Object,
  propertyKey: string | symbol
): HttpContext | undefined {
  return Reflect.getOwnMetadata(CONTEXT_METADATA, target, propertyKey);
}

/**
 * Reflect request method and checks that method has request context.
 */
export function hasContext(
  target: Object,
  propertyKey: string | symbol
): boolean {
  return Reflect.hasOwnMetadata(CONTEXT_METADATA, target, propertyKey);
}
