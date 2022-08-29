import 'reflect-metadata';
import { isNumber, isNil, isObject } from '../utils/common-type-guards.util';
import { extendObjectMetadata } from '../utils/extend-metadata.util';

const PATH_PARAMS_METADATA = Symbol('nhd-meta:pathParams');

export type PathParamsInMultyParameters = { [param: string]: number };
export type PathParamsInSingleParameter = number;
export type PathParamsType =
  | PathParamsInMultyParameters
  | PathParamsInSingleParameter;
export type PathParams = { [param: string]: any };

// FIXME не работает с дефотным значением для аргумента функции,
// как вариант можно сделать так  @Param('testParam', {default: 200})
/**
 * Parameter decorator. Specifies the path parameter for the request,
 * replace wildcard in path to value of the decorated parameter.
 *
 * ----------------------
 *
 * For example:
 * ```typescript
 * \@Get('/posts/:id')
 * public get(@Param('id') id: number): Observable<Post> {}
 * ```
 *
 * @publicApi
 */
export function Param(name: string): ParameterDecorator {
  return function (
    target: Object,
    propertyKey: string | symbol,
    parameterIndex: number
  ): void {
    extendObjectMetadata(
      PATH_PARAMS_METADATA,
      { [name]: parameterIndex },
      target,
      propertyKey
    );
  };
}

// FIXME не работает с дефотным значением для аргумента функции,
// как вариант можно сделать так  @Params({ default: { test: 200, test2: 'ss' } })
/**
 * Parameter decorator. Specifies the path parameters for the request,
 * replace matched wildcards in path to value of object that decorated.
 *
 * ----------------------
 *
 * For example:
 * ```typescript
 * \@Get('users/:userId/posts/:postId')
 * public get(@Param() ids: { userId: number, postId: number }): Observable<Post> {}
 * ```
 *
 * @publicApi
 */
export function Params(): ParameterDecorator {
  return function (
    target: Object,
    propertyKey: string | symbol,
    parameterIndex: number
  ): void {
    Reflect.defineMetadata(
      PATH_PARAMS_METADATA,
      parameterIndex,
      target,
      propertyKey
    );
  };
}

/**
 * Reflect request method and gets the all path parameters.
 */
export function getPathParams(
  target: Object,
  propertyKey: string | symbol,
  args: any[]
): PathParams | undefined {
  const pathParamsMetadata: PathParamsType = Reflect.getOwnMetadata(
    PATH_PARAMS_METADATA,
    target,
    propertyKey
  );

  // If defined with the @Params decorator
  if (isNumber(pathParamsMetadata)) {
    return args[pathParamsMetadata];
    // If defined with the @Params decorator
  } else {
    let pathParams: PathParamsInMultyParameters = {};

    for (const param in pathParamsMetadata) {
      if (Object.prototype.hasOwnProperty.call(pathParamsMetadata, param)) {
        const parameterIndex = pathParamsMetadata[param];
        const value = args[parameterIndex];

        if (!isNil(value)) {
          pathParams[param] = value;
        }
      }
    }

    return pathParams;
  }
}

/**
 * Reflect request method and checks that method has path parameters.
 */
export function hasPathParams(
  target: Object,
  propertyKey: string | symbol
): boolean {
  const pathParams: PathParamsType = Reflect.getOwnMetadata(
    PATH_PARAMS_METADATA,
    target,
    propertyKey
  );

  if (isNumber(pathParams)) {
    return true;
  }

  return isObject(pathParams) && Object.keys(pathParams).length > 0;
}
