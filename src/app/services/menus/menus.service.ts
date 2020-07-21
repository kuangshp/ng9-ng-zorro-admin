import { Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenusService extends BaseService {

  // 请求菜单
  public menusApi$(): Observable<any> {
    return this.get('/admin/access/menus');
  }
}
