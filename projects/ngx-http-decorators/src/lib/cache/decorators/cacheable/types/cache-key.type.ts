export type CacheKeyFunctionOptions = {
  args: unknown[];
};

export type CacheKeyFunction = (options: CacheKeyFunctionOptions) => string;
