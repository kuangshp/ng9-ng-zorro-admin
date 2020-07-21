import { NgModule } from '@angular/core';

import { SystemRoutingModule } from './system-routing.module';
import { UserComponent } from './user/user.component';
import { RoleComponent } from './role/role.component';
import { AccessComponent } from './access/access.component';
import { SharedModule } from '@app/module/shared/shared.module';
import { EditUserComponent } from './user/modal/edit-user/edit-user.component';
import { EditRoleComponent } from './role/modal/edit-role/edit-role.component';
import { EditAccessComponent } from './access/modal/edit-access/edit-access.component';
import { AccessModalComponent } from './role/modal/access-modal/access-modal.component';
import { RoleModalComponent } from './user/modal/role-modal/role-modal.component';

@NgModule({
  entryComponents: [
    AccessModalComponent,
    RoleModalComponent
  ],
  declarations: [
    UserComponent,
    RoleComponent,
    AccessComponent,
    EditUserComponent,
    EditRoleComponent,
    EditAccessComponent,
    AccessModalComponent,
    RoleModalComponent,
  ],
  imports: [
    SystemRoutingModule,
    SharedModule,
  ]
})
export class SystemModule { }
