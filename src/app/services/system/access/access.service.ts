import { Injectable } from '@angular/core';
import { BaseService } from '@app/services/base/base.service';
import { Observable } from 'rxjs';
import { ObjectType } from '@app/types';

@Injectable({
  providedIn: 'root'
})
export class AccessService extends BaseService {
  // 获取权限列表
  public accessList$(params?: ObjectType): Observable<any> {
    return this.get('admin/access', params)
  }

  // 创建资源
  public createAccessApi$(data: ObjectType): Observable<any> {
    return this.post('admin/access', data);
  }

  // 删除资源
  public deleteAccess$(id: string): Observable<any> {
    return this.delete(`admin/access/${id}`);
  }

  // 更新资源
  public updateAccess$(id: string, data: ObjectType): Observable<any> {
    return this.patch(`admin/access/${id}`, data);
  }

  // 获取全部的模块
  public accessParentList$(type: string): Observable<any> {
    return this.get(`admin/access/module/${type}`);
  }

  // 获取全部的角色权限
  public authorizationList$(type: string, roleId: string): Observable<any> {
    return this.get(`admin/access/authorization/${type}/${roleId}`);
  }
}
