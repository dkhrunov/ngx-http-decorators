import 'reflect-metadata';

export function defineMetadataInMethodContext(
  metadataKey: any,
  value: any,
  target: Object,
  propertyKey: string | symbol
): void {
  Reflect.defineMetadata(metadataKey, value, Reflect.get(target, propertyKey));
}

export function getMetadataFromMethodContext(
  metadataKey: any,
  method: (...args: any[]) => any
): any {
  return Reflect.getOwnMetadata(metadataKey, method);
}
