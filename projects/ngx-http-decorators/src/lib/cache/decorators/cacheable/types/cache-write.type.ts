export type CacheWriteFunctionOptions<TIncoming, TExisting = TIncoming> = {
  args: unknown[];
  incoming: TIncoming;
  existing: TExisting | undefined;
};

export type CacheWrite<TIncoming, TExisting = TIncoming> = (
  options: CacheWriteFunctionOptions<TIncoming, TExisting>
) => TExisting;
