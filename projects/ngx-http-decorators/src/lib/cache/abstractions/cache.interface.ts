export interface ICache {
  /**
   * Save value by key in the cache.
   */
  set<T>(key: string, value: T): void;

  /**
   * Get cached value by key.
   */
  get<T>(key: string): T | undefined;

  /**
   * Delete cached value by key.
   */
  delete(key: string | string[]): void;

  /**
   * Clear all values in the cache.
   */
  clear(): void;
}
