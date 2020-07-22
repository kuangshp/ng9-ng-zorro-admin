import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoggingInterceptor } from '@app/interceptors/logging.interceptor';
import { ParamInterceptor } from '@app/interceptors/param.interceptor';
import { LoginService } from './login/login.service';
import { UserService } from './system/user/user.service';
import { MenusService } from './menus/menus.service';
import { RoleService } from './system/role/role.service';
import { AccessService } from './system/access/access.service';
import { DictService } from './system/dict/dict.service';

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
    RoleService,
    AccessService,
    DictService,
  ],
  exports: []
})
export class ServiceModule { }
