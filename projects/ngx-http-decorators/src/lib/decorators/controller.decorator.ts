import { isString, isPlainObject } from "../utils/common-type-guards.util";

const HOST_METADATA = Symbol('nhd-meta:host');
const PATH_PREFIX_METADATA = Symbol('nhd-meta:pathPrefix');

/**
 * A class decorator to specify the path prefix for all requests in this class.
 *
 * ----------------------
 *
 * For example:
 * ```typescript
 * /@Injectable({ providedIn: 'root' })
 * /@HttpController('/api/v2')
 * export class ApiService {}
 * ```
 *
 * @publicApi
 */
export function HttpController(prefix: string): ClassDecorator;

/**
 * A class decorator to specify the options for all requests in this class.
 *
 * ----------------------
 *
 * For example:
 * ```typescript
 * /@Injectable({ providedIn: 'root' })
 * /@HttpController({ host: 'http://test.com', pathPrefix: '/api/v2' })
 * export class ApiService {}
 * ```
 *
 * @publicApi
 */
export function HttpController(prefixOrOptions: {
  pathPrefix?: string;
  host?: string;
}): ClassDecorator;

export function HttpController(
  prefixOrOptions:
    | {
        pathPrefix?: string;
        host?: string;
      }
    | string
): ClassDecorator {
  if (isString(prefixOrOptions)) {
    return (target: Function): void => {
      Reflect.metadata(PATH_PREFIX_METADATA, prefixOrOptions)(target);
      Reflect.defineMetadata(PATH_PREFIX_METADATA, prefixOrOptions, target);
    };
  }

  return (target: Function): void => {
    if (isPlainObject(prefixOrOptions)) {
      const { pathPrefix, host } = prefixOrOptions;

      if (isString(pathPrefix)) {
        Reflect.defineMetadata(PATH_PREFIX_METADATA, pathPrefix, target);
      }

      if (isString(host)) {
        Reflect.defineMetadata(HOST_METADATA, host, target);
      }
    }
  };
}

/**
 * Reflect class and gets the host for all requests specified in this class.
 */
export function getHost(target: Object): string | undefined {
  return Reflect.getOwnMetadata(HOST_METADATA, target);
}

/**
 * Reflect class and gets the path prefix for all requests specified in this class.
 */
export function getPathPrefix(target: Object): string | undefined {
  return Reflect.getOwnMetadata(PATH_PREFIX_METADATA, target);
}
