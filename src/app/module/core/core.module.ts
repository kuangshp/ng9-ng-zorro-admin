import { NgModule, SkipSelf, Optional } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ViewsModule } from '../../views/views.module';
import { SharedModule } from '../shared/shared.module';
import { AppRoutingModule } from '../../app-routing.module';
import { NZ_I18N, en_US } from 'ng-zorro-antd';
// 配置 angular i18n
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/zh';
import { AuthGuard } from '../../auth/auth.guard';
import { ServiceModule } from '@app/services/service.module';
registerLocaleData(en);

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ServiceModule,
    ViewsModule,
    SharedModule,
    AppRoutingModule,
  ],
  exports: [
    AppRoutingModule,
    SharedModule,
  ],
  providers: [AuthGuard, { provide: NZ_I18N, useValue: en_US }],
})
export class CoreModule {
  constructor (@SkipSelf() @Optional() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule 只能被appModule引入');
    }
  }
}
