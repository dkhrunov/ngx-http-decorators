import 'reflect-metadata';
import { isNumber, isNil, isObject } from '../utils/common-type-guards.util';
import { extendObjectMetadata } from '../utils/extend-metadata.util';

const QUERY_PARAMS_METADATA = Symbol('nhd-meta:queryParams');

export type QueryParamsInMultyParameters = { [param: string]: number };
export type QueryParamsInSingleParameter = number;
export type QueryParamsType =
  | QueryParamsInMultyParameters
  | QueryParamsInSingleParameter;
export type QueryParams = { [param: string]: any };

// FIXME не работает с дефотным значением для аргумента функции,
// как вариант можно сделать так  @Query('testParam', {default: 200})
/**
 * Parameter decorator. Specifies the query parameter,
 * where the value of decorated parameter is value of the query parameter.
 *
 * ----------------------
 *
 * For example:
 * ```typescript
 * // path - '/posts?pageIndex={pageIndex_value}'
 * \@Get('/posts')
 * public get(@Query('pageIndex') pageIndex: number): Observable<Post[]> {}
 * ```
 *
 * @publicApi
 */
export function Query(name: string): ParameterDecorator {
  return function (
    target: Object,
    propertyKey: string | symbol,
    parameterIndex: number
  ): void {
    extendObjectMetadata(
      QUERY_PARAMS_METADATA,
      { [name]: parameterIndex },
      target,
      propertyKey
    );
  };
}

// FIXME не работает с дефотным значением для аргумента функции,
// как вариант можно сделать так  @Queries({ default: { test: 200, test2: 'ss' } })
/**
 * Parameter decorator. Specifies the query parameter,
 * where the value of decorated parameter is mapped to query parameters.
 *
 * ----------------------
 *
 * For example:
 * ```typescript
 * // path - '/posts?pageIndex={pageIndex_value}&limit={limit_value}'
 * \@Get('/posts')
 * public get(@Queries() params: { pageIndex: number, limit: number }): Observable<Post[]> {}
 * ```
 *
 * @publicApi
 */
export function Queries(): ParameterDecorator {
  return function (
    target: Object,
    propertyKey: string | symbol,
    parameterIndex: number
  ): void {
    Reflect.defineMetadata(
      QUERY_PARAMS_METADATA,
      parameterIndex,
      target,
      propertyKey
    );
  };
}

/**
 * Reflect request method and gets the all query parameters.
 */
export function getQueryParams(
  target: Object,
  propertyKey: string | symbol,
  args: any[]
): QueryParams | undefined {
  const queryParamsMetadata: QueryParamsType = Reflect.getOwnMetadata(
    QUERY_PARAMS_METADATA,
    target,
    propertyKey
  );

  // If defined with the @Queries decorator
  if (isNumber(queryParamsMetadata)) {
    return args[queryParamsMetadata];
    // If defined with the @Query decorator
  } else {
    let queryParams: QueryParamsInMultyParameters = {};

    for (const param in queryParamsMetadata) {
      if (Object.prototype.hasOwnProperty.call(queryParamsMetadata, param)) {
        const parameterIndex = queryParamsMetadata[param];
        const value = args[parameterIndex];

        if (!isNil(value)) {
          queryParams[param] = value;
        }
      }
    }

    return queryParams;
  }
}

/**
 * Reflect request method and checks that method has query parameters.
 */
export function hasQueryParams(
  target: Object,
  propertyKey: string | symbol
): boolean {
  const queryParams: QueryParamsType = Reflect.getOwnMetadata(
    QUERY_PARAMS_METADATA,
    target,
    propertyKey
  );

  if (isNumber(queryParams)) {
    return true;
  }

  return isObject(queryParams) && Object.keys(queryParams).length > 0;
}
