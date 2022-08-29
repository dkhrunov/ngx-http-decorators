import { isString, isSymbol } from "./common-type-guards.util";

export function extendArrayMetadata<T extends Array<unknown>>(
  key: string | symbol,
  metadata: T,
  target: any,
  propertyKey?: string | symbol
) {
  if (isString(propertyKey) || isSymbol(propertyKey)) {
    const previousValue =
      Reflect.getOwnMetadata(key, target, propertyKey) || [];
    const value = [...previousValue, ...metadata];
    Reflect.defineMetadata(key, value, target, propertyKey);
  } else {
    const previousValue = Reflect.getOwnMetadata(key, target) || [];
    const value = [...previousValue, ...metadata];
    Reflect.defineMetadata(key, value, target);
  }
}

export function extendObjectMetadata<T extends { [key: string]: any }>(
  key: string | symbol,
  metadata: T,
  target: any,
  propertyKey?: string | symbol
) {
  if (isString(propertyKey) || isSymbol(propertyKey)) {
    const previousValue =
      Reflect.getOwnMetadata(key, target, propertyKey) || {};
    const value = { ...previousValue, ...metadata };
    Reflect.defineMetadata(key, value, target, propertyKey);
  } else {
    const previousValue = Reflect.getOwnMetadata(key, target) || {};
    const value = { ...previousValue, ...metadata };
    Reflect.defineMetadata(key, value, target);
  }
}
