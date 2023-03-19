import { Injectable } from '@angular/core';
import { ICache } from './abstractions/cache.interface';

@Injectable({
  providedIn: 'root'
})
export class NgxHttpInMemoryCache implements ICache {
  private readonly cache = new Map<string, unknown>();

  public set<T>(key: string, value: T): void {
    this.cache.set(key, value);
  }

  public get<T>(key: string): T | undefined {
    return this.cache.get(key) as T;
  }

  public delete(key: string | string[]): void {
    if (Array.isArray(key)) {
      key.forEach((k) => this.cache.delete(k));
    } else {
      this.cache.delete(key);
    }
  }

  public clear(): void {
    this.cache.clear();
  }
}
