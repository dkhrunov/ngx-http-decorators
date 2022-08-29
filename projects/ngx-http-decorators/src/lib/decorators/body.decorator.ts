import 'reflect-metadata';

const BODY_METADATA = Symbol('nhd-meta:body');

/**
 * Parameter decorator. Specifies the `body` for the request with the value of the decorated parameter.
 *
 * ----------------------
 *
 * For example:
 * ```typescript
 * public create(@Body() createDto: CreateSomethingDto): Observable<SomethingDto> {}
 * ```
 *
 * @publicApi
 */
export function Body(): ParameterDecorator {
  return function (
    target: Object,
    propertyKey: string | symbol,
    parameterIndex: number
  ): void {
    Reflect.defineMetadata(BODY_METADATA, parameterIndex, target, propertyKey);
  };
}

/**
 * Reflect request method and gets the body of request.
 */
export function getBody<T = any>(
  target: Object,
  propertyKey: string | symbol,
  args: any[]
): T | undefined {
  const bodyParameterIndex: number = Reflect.getOwnMetadata(
    BODY_METADATA,
    target,
    propertyKey
  );

  return args[bodyParameterIndex];
}

/**
 * Reflect request method and checks that method has body.
 */
export function hasBody(target: Object, propertyKey: string | symbol): boolean {
  return Reflect.hasOwnMetadata(BODY_METADATA, target, propertyKey);
}
