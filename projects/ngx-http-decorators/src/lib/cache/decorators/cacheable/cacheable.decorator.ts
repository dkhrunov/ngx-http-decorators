/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable require-jsdoc */
import { inject } from '@angular/core';
import { Observable, of, shareReplay, tap } from 'rxjs';
import { ICache } from '../../abstractions';
import { DEFAULT_CACHE } from '../../constants';
import { CacheableOptions } from './types/cacheable-options.type';

const generateCacheKey = (
  target: object,
  methodName: string | symbol,
  args: unknown[]
): string => {
  const cacheKeyPrefix = `${target.constructor.name}_${methodName.toString()}`;
  const key = `${cacheKeyPrefix}_${JSON.stringify(args)}`;

  return key;
};

function resolveCacheStorage<TIncoming, TExisting = TIncoming>(
  options?: Pick<CacheableOptions<TIncoming, TExisting>, 'cache'>
): ICache {
  if (options?.cache) {
    return inject(options.cache);
  }

  return inject(DEFAULT_CACHE);
}

const resolveCacheKey = <TIncoming, TExisting = TIncoming>(
  target: object,
  methodName: string | symbol,
  args: unknown[],
  options?: Pick<CacheableOptions<TIncoming, TExisting>, 'key'>
): string => {
  if (options?.key) {
    if (typeof options.key === 'function') {
      return options.key({ args });
    }

    return options?.key;
  }

  return generateCacheKey(target, methodName, args);
};

const readCachedValue = <TIncoming, TExisting = TIncoming>(
  args: unknown[],
  cache: ICache,
  cacheKey: string,
  options?: Pick<CacheableOptions<TIncoming, TExisting>, 'read'>
): TIncoming | undefined => {
  if (options?.read) {
    const existing = cache.get<TExisting>(cacheKey);
    return options.read({ args, existing });
  }

  return cache.get<TIncoming>(cacheKey);
};

const writeCacheValue = <TIncoming, TExisting = TIncoming>(
  args: unknown[],
  incoming: TIncoming,
  cache: ICache,
  cacheKey: string,
  options?: Pick<CacheableOptions<TIncoming, TExisting>, 'write'>
): void => {
  if (options?.write) {
    const existing = cache.get<TExisting>(cacheKey);
    const value = options.write({ args, incoming, existing });
    cache.set<TExisting>(cacheKey, value);
  } else {
    cache.set<TIncoming>(cacheKey, incoming);
  }
};

/**
 * Caches the result of an http request. On subsequent calls to the decorated method,
 * data will be returned from the cache until the cache is invalidated (reset).
 *----------------
 *
 * __IMPORTANT:__
 *
 * 1. Use a subscription to a cached request with a `take(1)` operator, or with an unsubscribe, because the original `Observable`
 * returned from `HttpClient` turns from `Cold Observable` to `Hot Observable`,
 * if `Cold Observable` creates a new thread (new request) for each subscription, then `Hot Observable` fumbles this subscription.
 *
 * 2. The method being decorated should not have side effects, because after caching the body of this function will not be re-executed,
 * because the value of the request is immediately taken from their cache.
 *
 * @example
 * ```typescript
 * ...
 * \@Cacheable<Response, UsersService>({ key: 'CustomKey', })
 * public request(): Observable<Response> { }
 * ...
 * ```
 * ----------------
 * @param options Опцци кеширования.
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions, require-jsdoc, max-lines-per-function
export function Cacheable<TIncoming, TExisting = TIncoming>(
  options?: CacheableOptions<TIncoming, TExisting>
): MethodDecorator {
  // eslint-disable-next-line max-lines-per-function
  return (
    target: object,
    methodName: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) => {
    if (!(descriptor?.value instanceof Function)) {
      throw new TypeError(
        '"Cacheable" decorator can only be applied to a class method that returns an Observable'
      );
    }

    const originalMethod = descriptor.value as (
      ...args: unknown[]
    ) => Observable<TIncoming>;

    descriptor.value = function (...args: unknown[]): Observable<TIncoming> {
      const cache = resolveCacheStorage.bind(target)<TIncoming, TExisting>(
        options
      );
      const cacheKey = resolveCacheKey<TIncoming, TExisting>(
        target,
        methodName,
        args,
        options
      );
      const cachedValue = readCachedValue<TIncoming, TExisting>(
        args,
        cache,
        cacheKey,
        options
      );

      if (cachedValue) {
        return of(cachedValue);
      }

      const originalRequest = originalMethod.apply(this, args);

      if (!(originalRequest instanceof Observable)) {
        throw new TypeError(
          `"Cacheable": Decorated method "${methodName.toString()}" in class "${
            target.constructor.name
          }" must return an Observable value.`
        );
      }

      return originalRequest.pipe(
        tap((incoming) =>
          writeCacheValue(args, incoming, cache, cacheKey, options)
        ),
        shareReplay(1)
      );
    };

    return descriptor;
  };
}
