import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoggingInterceptor } from '@app/interceptors/logging.interceptor';
import { ParamInterceptor } from '@app/interceptors/param.interceptor';
import { LoginService } from '@app/services/login/login.service';
import { UserService } from '@app/services/user/user.service';
import { MenusService } from '@app/services/menus/menus.service';

@NgModule({
  declarations: [],
  imports: [
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ParamInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoggingInterceptor,
      multi: true
    },
    LoginService,
    UserService,
    MenusService,
  ],
  exports: []
})
export class ServicesModule { }
