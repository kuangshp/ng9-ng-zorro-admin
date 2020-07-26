import { Component, OnInit, } from '@angular/core';
import { UserService } from '@app/services/system/user/user.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { ObjectType } from '@app/types';
import { UserModalComponent } from './modal/user-modal/user-modal.component';
import { UserRoleModalComponent } from './modal/user-role-modal/user-role-modal.component';
import { defaultPassword } from '@app/constant';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  // 表格数据
  tableList = [];
  // 数据加载中
  loadData: boolean = true;
  // 总共多少条数据
  tableTotal: number = 0;

  // 搜索条件
  formData: ObjectType = {
    username: '',
    mobile: '',
    status: '',
    email: '',
  }


  constructor (
    private readonly userService: UserService,
    private readonly message: NzMessageService,
    private readonly nzModalService: NzModalService,
    private readonly modal: NzModalService,
  ) { }

  ngOnInit() {
    this.initUserList(this.searchData());
  }
  // 添加数据弹框
  addUser(): void {
    this.nzModalService.create({
      nzTitle: '添加用户',
      nzContent: UserModalComponent,
      nzOkText: '确认',
      nzCancelText: '取消',
      nzOnOk: async (componentInstance) => {
        const result = await componentInstance.handleOk();
        if (result) {
          this.initUserList(this.searchData());
        }
        return result;
      }
    })
  }

  // 编辑用户
  editUser(data: ObjectType): void {
    this.nzModalService.create({
      nzTitle: '编辑用户',
      nzContent: UserModalComponent,
      nzComponentParams: {
        rowData: data,
      },
      nzOkText: '确认',
      nzCancelText: '取消',
      nzOnOk: async (componentInstance) => {
        const result = await componentInstance.handleOk();
        if (result) {
          this.initUserList(this.searchData());
        }
        return result;
      }
    })
  }

  // 获取数据
  initUserList(params?: object) {
    this.userService.userListApi$(params).subscribe(data => {
      const { code, message, result } = data;
      if (Object.is(code, 0)) {
        this.tableList = result.data;
        this.tableTotal = result.total;
        this.loadData = false;
      } else {
        console.log(message);
      }
    })
  }

  // 分配角色弹框
  assignRole(data: any): void {
    this.nzModalService.create({
      nzTitle: '分配角色',
      nzWidth: 450,
      nzContent: UserRoleModalComponent,
      nzComponentParams: {
        userId: data.id
      },
      nzOnOk: async (componentInstance) => { // 保存
        return await componentInstance.handleOk();
      }
    })
  }

  // 重置密码为默认密码
  resetPassword(data: any): void {
    this.modal.confirm({
      nzTitle: '重置为默认密码提示?',
      nzContent: `<b style="color: red;">是否将密码重置为: ${defaultPassword}</b>`,
      nzOkText: '确认',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.userService.resetPassword$(data.id).subscribe(data => {
          const { code, message, result } = data;
          if (Object.is(code, 0)) {
            this.message.create('success', message);
          } else {
            this.message.create('error', message);
          }
        })
      },
      nzCancelText: '取消',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  // 删除用户
  deleteUser(data: any): void {
    this.modal.confirm({
      nzTitle: '删除用户提示?',
      nzContent: `<b style="color: red;">是否要删除: ${data.username}该用户</b>`,
      nzOkText: '确认',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.userService.deleteUser$(data.id).subscribe(data => {
          const { code, message, result } = data;
          if (Object.is(code, 0)) {
            this.initUserList(this.searchData());
            this.message.create('success', message);
          } else {
            this.message.create('error', message);
          }
        })
      },
      nzCancelText: '取消',
      nzOnCancel: () => console.log('Cancel')
    });
  }
  // 切换页面
  changePage(params: ObjectType) {
    this.loadData = true;
    this.initUserList(this.searchData(params));
  }

  // 设置搜索的条件
  private searchData(params?: ObjectType) {
    return {
      pageNum: 1,
      pageSize: 10,
      ...params,
    }
  }
}
