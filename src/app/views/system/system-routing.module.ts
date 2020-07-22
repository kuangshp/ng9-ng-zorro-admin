import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user/user.component';
import { RoleComponent } from './role/role.component';
import { AccessComponent } from './access/access.component';
import { DictComponent } from './dict/dict.component';


const routes: Routes = [
  {
    path: 'user',
    component: UserComponent,
    data: {
      title: '用户中心',
      breadcrumb: '用户中心',
    }
  },
  {
    path: 'role',
    component: RoleComponent,
    data: {
      title: '角色管理',
      breadcrumb: '角色管理',
    }
  },
  {
    path: 'access',
    component: AccessComponent,
    data: {
      title: '资源管理',
      breadcrumb: '资源管理',
    }
  },
  {
    path: 'dict',
    component: DictComponent,
    data: {
      title: '字典管理',
      breadcrumb: '字典管理',
    }
  },
  {
    path: '**',
    redirectTo: 'user',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule { }
