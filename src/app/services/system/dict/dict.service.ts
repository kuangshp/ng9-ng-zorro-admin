import { Injectable } from '@angular/core';
import { BaseService } from '@app/services/base/base.service';
import { Observable } from 'rxjs';
import { ObjectType } from '@app/types';

@Injectable({
  providedIn: 'root'
})
export class DictService extends BaseService {
  // 添加字段
  addDict$(postData: ObjectType): Observable<any> {
    return this.post('admin/dict_config', postData);
  }

  delDict$(id: string): Observable<any> {
    return this.delete(`admin/dict_config/${id}`);
  }

  updateDict$(id: string, postData: ObjectType): Observable<any> {
    return this.patch(`admin/dict_config/${id}`, postData)
  }

  // 获取字典列表
  dictList$(params?: ObjectType): Observable<any> {
    return this.get('admin/dict_config', params);
  }

  // 根据具体的类型获取字典
  dictByType$(typeObj: ObjectType): Observable<any> {
    return this.get('admin/dict_config/category', typeObj);
  }
}
