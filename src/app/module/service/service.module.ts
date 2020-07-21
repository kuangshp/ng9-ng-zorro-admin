import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoggingInterceptor } from '@app/interceptors/logging.interceptor';
import { ParamInterceptor } from '@app/interceptors/param.interceptor';
import { LoginService } from '@app/services/login/login.service';
import { MenusService } from '@app/services/menus/menus.service';
import { UserService } from '@app/services/system/user/user.service';
import { RoleService } from '@app/services/system/role/role.service';
import { AccessService } from '@app/services/system/access/access.service';

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
  ],
  exports: []
})
export class ServiceModule { }
