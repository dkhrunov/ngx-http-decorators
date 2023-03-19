export type CacheReadFunctionOptions<TExisting> = {
  args: unknown[];
  existing: TExisting | undefined;
};

export type CacheRead<TIncoming, TExisting = TIncoming> = (
  options: CacheReadFunctionOptions<TExisting>
) => TIncoming | undefined;
