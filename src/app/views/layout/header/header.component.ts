import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppStoreModule } from '@app/store/store.module';
import { getCurrentCollapsed } from '@app/store/selectors';
import { toggleMenu } from '@app/store/actions';
import { Router } from '@angular/router';
import { storage } from '@app/utils'
import { NzModalService } from 'ng-zorro-antd';
import { ModifyPasswordComponent } from '../modify-password/modify-password.component';
import { CommonService } from '@app/services/tools/common/common.service';
import { USER_INFO } from '@app/config';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  username: string = '';
  isCollapsed: boolean = false;
  constructor (
    private store$: Store<AppStoreModule>,
    private router: Router,
    private readonly modalService: NzModalService,
    private readonly commentService: CommonService,
  ) { }

  ngOnInit() {
    this.store$.pipe(select('isCollapsed' as any), select(getCurrentCollapsed)).subscribe(item => {
      this.isCollapsed = item;
    });
    this.username = JSON.parse(storage.getItem(USER_INFO)).username;
  }

  toggleMenu(): void {
    this.store$.dispatch(toggleMenu());
  }

  // 修改密码
  public modifyPassword(): void {
    this.modalService.create({
      nzTitle: '修改密码',
      nzContent: ModifyPasswordComponent,
      nzOnOk: (contentComponentInstance) => {
        return contentComponentInstance.handleOk();
      },
    });
  }

  // 个人信息
  public userInfo(): void {
    this.commentService.event('selectedMenu', {
      id: -1,
      url: '/system/user_info',
      icon: 'solution',
      name: '个人中心',
      select: true,
      enabled: false,
      close: true,
      refresh: 'Y',
    });
    console.log('个人信息');
  }

  // 退出
  public logout(): void {
    storage.clear();
    this.router.navigateByUrl('/login');
  }
}
