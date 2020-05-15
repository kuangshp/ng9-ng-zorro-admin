import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user/user.component';
import { AccessComponent } from './access/access.component';
import { RoleComponent } from './role/role.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'user',
    pathMatch: 'full',
  },
  {
    path: 'user',
    component: UserComponent,
    data: {
      title: '用户中心',
      breadcrumb: '用户中心'
    }
  },
  {
    path: 'access',
    component: AccessComponent,
    data: {
      title: '资源中心',
      breadcrumb: '资源中心'
    }
  },
  {
    path: 'role',
    component: RoleComponent,
    data: {
      title: '角色中心',
      breadcrumb: '角色中心'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule { }
