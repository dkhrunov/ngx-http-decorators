import { HttpOptions } from './http-options.interface';

export type DecoratedHttpRequestOptions = Omit<
  HttpOptions,
  'body' | 'headers' | 'params' | 'pathParams' | 'context' | 'pathPrefix'
>;
