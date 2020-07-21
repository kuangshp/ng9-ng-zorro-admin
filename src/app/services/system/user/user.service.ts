import { Injectable } from '@angular/core';
import { BaseService } from '@app/services/base/base.service';
import { Observable } from 'rxjs';
import { ObjectType } from '@app/types';


@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {
  // 获取用户列表
  public userListApi$(params?: object): Observable<any> {
    if (params && Object.keys(params).length) {
      return this.get('admin/user', params);
    } else {
      return this.get('admin/user');
    }
  }

  // 根据条件查询到第一条数据
  public searchApi$(params: object): Observable<any> {
    return this.post('admin/user/search', params);
  }

  // 创建用户
  public createUserApi$(params: object): Observable<any> {
    return this.post('admin/user', params);
  }

  // 重置用户密码为默认密码
  public resetPassword$(id: string): Observable<any> {
    return this.patch(`admin/user/reset_password/${id}`);
  }

  // 删除用户
  public deleteUser$(id: string): Observable<any> {
    return this.delete(`admin/user/${id}`);
  }

  // 修改用户数据
  public updateUser$(id: string, data: object): Observable<any> {
    return this.patch(`admin/user/${id}`, data);
  }

  // 用户修改密码
  public modifyPassword$(params: ObjectType): Observable<any> {
    return this.patch('admin/user/modify_password', params);
  }

  // 获取角色树
  public roleTreeList$(userId: number): Observable<any> {
    return this.get(`admin/user/role_tree/${userId}`);
  }

  // 分配角色
  public assiginRole$(params: ObjectType): Observable<any> {
    return this.post('admin/user/assigin_role', params);
  }
}
