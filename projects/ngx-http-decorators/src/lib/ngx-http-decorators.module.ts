import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { Injector, NgModule } from '@angular/core';
import { ReflectiveHttpClient } from './reflective-http-client.service';

@NgModule({ imports: [CommonModule], providers: [ReflectiveHttpClient, provideHttpClient(withInterceptorsFromDi())] })
export class NgxHttpDecoratorsModule { 
  public static injector: Injector;

  constructor(injector: Injector) {
    NgxHttpDecoratorsModule.injector = injector;
  }
}
