import { Component, OnInit, Input } from '@angular/core';
import { TransferItem, NzMessageService } from 'ng-zorro-antd';
import { UserService } from '@app/services/system/user/user.service';

@Component({
  selector: 'app-user-role-modal',
  templateUrl: './user-role-modal.component.html',
  styleUrls: ['./user-role-modal.component.scss']
})
export class UserRoleModalComponent implements OnInit {
  @Input() userId: number;
  list: TransferItem[] = [];

  constructor (
    private readonly userService: UserService,
    private readonly message: NzMessageService,
  ) { }
  
  ngOnInit(): void {
    this.initRoleTreeList();
  }

  // 根据用户id获取角色列表
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
