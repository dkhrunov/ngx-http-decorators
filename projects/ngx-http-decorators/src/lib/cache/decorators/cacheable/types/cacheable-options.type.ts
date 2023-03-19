import { InjectionToken } from '@angular/core';
import { ICache } from '../../../abstractions/cache.interface';
import { CacheKeyFunction } from './cache-key.type';
import { CacheRead } from './cache-read.type';
import { CacheWrite } from './cache-write.type';

export type CacheableOptions<TIncoming, TExisting = TIncoming> = {
  /**
   * The key under the content will store the cached value,
   * can be specified as a string or function if trumpeted
   * Danger is a more complex version of the key.
   *
   * @default string look like this `'{{className}}_{{methodName}}_{{args}}'`.
   */
  key?: string | CacheKeyFunction;
  /**
   * Setting how the value will be written to the cache.
   */
  write?: CacheWrite<TIncoming, TExisting>;
  /**
   * Setting how the value will be read from the cache.
   */
  read?: CacheRead<TIncoming, TExisting>;
  /**
   * A different cache storage is indicated, if not passed value,
   * then the standard `HttpNgxHttpInMemoryCache` storage will be used.
   *
   * @default HttpNgxHttpInMemoryCache
   */
  cache?: InjectionToken<ICache>;
};
