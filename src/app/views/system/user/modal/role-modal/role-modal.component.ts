import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NzTreeNode, NzMessageService, NzTreeComponent, TransferItem, TransferChange } from 'ng-zorro-antd';
import { UserService } from '@app/services/system/user/user.service';

@Component({
  selector: 'app-role-modal',
  templateUrl: './role-modal.component.html',
  styleUrls: ['./role-modal.component.scss']
})
export class RoleModalComponent implements OnInit {
  @Input() userId: number;
  list: TransferItem[] = [];

  constructor (
    private readonly userService: UserService,
    private readonly message: NzMessageService,
  ) { }
  ngOnInit(): void {
    this.initRoleTreeList();
  }

  initRoleTreeList(): void {
    this.userService.roleTreeList$(this.userId).subscribe(data => {
      const { code, message, result } = data;
      if (Object.is(code, 0)) {
        this.list = result;
      }
    })
  }

  // 确定提交
  async handleOk(): Promise<boolean> {
    const selectedRoleList = this.list.filter(item => item.direction === 'right').map(item => item.id);
    let postData = {
      userId: this.userId,
      roleList: selectedRoleList
    }
    // 提交分配权限
    const { code, message, result } = await this.userService.assiginRole$(postData).toPromise();
    if (Object.is(code, 0)) {
      this.message.create('success', message);
      return true;
    } else {
      this.message.create('error', message);
      return false;
    }
  }
}
