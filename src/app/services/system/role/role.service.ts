import { Injectable } from '@angular/core';
import { BaseService } from '@app/services/base/base.service';
import { Observable } from 'rxjs';
import { ObjectType } from '@app/types';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends BaseService {
  // 获取角色列表
  public roleListApi$(params?: object): Observable<any> {
    const url = 'admin/role';
    if (params && Object.keys(params).length) {
      return this.get(url, params);
    } else {
      return this.get(url);
    }
  }

  // 创建数据
  public createUserApi$(params: object): Observable<any> {
    return this.post('/admin/role', params);
  }

  // 更新角色
  public updateRole$(id: string, params?: object): Observable<any> {
    return this.patch(`/admin/role/${id}`, params)
  }

  // 删除角色
  public delete$(id: string): Observable<any> {
    return this.delete(`/admin/role/${id}`);
  }

  // 给角色分配权限
  public assiginAccess$(params: ObjectType): Observable<any> {
    return this.post('admin/role/assigin_access', params)
  }
}
