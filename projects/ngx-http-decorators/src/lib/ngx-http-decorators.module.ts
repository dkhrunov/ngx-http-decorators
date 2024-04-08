import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Injector, NgModule } from '@angular/core';
import { ReflectiveHttpClient } from './reflective-http-client.service';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  providers: [ReflectiveHttpClient],
})
export class NgxHttpDecoratorsModule { 
  public static injector: Injector;

  constructor(injector: Injector) {
    NgxHttpDecoratorsModule.injector = injector;
  }
}
