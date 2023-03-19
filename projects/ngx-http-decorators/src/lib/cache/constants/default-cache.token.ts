import { inject, InjectionToken } from '@angular/core';
import { NgxHttpDecoratorsModule } from '../../ngx-http-decorators.module';
import { ICache } from '../abstractions';
import { NgxHttpInMemoryCache } from '../in-memory-cache.service';

export const DEFAULT_CACHE = new InjectionToken<ICache>(
  'Nhd/DEFAULT_CACHE',
  {
    providedIn: NgxHttpDecoratorsModule,
    factory: () => inject(NgxHttpInMemoryCache)
  }
);
