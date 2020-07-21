import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from '@app/services/system/user/user.service';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { Router } from '@angular/router';
import { RoleModalComponent } from './modal/role-modal/role-modal.component';
import { ObjectType } from '@app/types';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  constructor (
    private readonly userService: UserService,
    private readonly message: NzMessageService,
    private readonly router: Router,
    private readonly nzModalService: NzModalService,
  ) { }
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
  // 是否打开弹框
  isOpenModal: boolean = false;

  // 编辑数据传递到子组件中
  rowData: any = {};
  listOfFilterStatus: any[] = [
    { text: '可用', value: '1' },
    { text: '禁用', value: '0' }
  ];

  // 添加数据弹框
  addUser(): void {
    this.rowData = {};
    this.isOpenModal = true;
  }

  // 编辑用户
  editUser(data: any): void {
    this.rowData = data;
    this.isOpenModal = true;
  }

  ngOnInit() {
    this.initUserList();
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

  // 子组件添加数据成功后请求数据
  saveSuccess(): void {
    this.isOpenModal = false;
    this.loadData = true;
    this.initUserList();
  }

  // 关闭弹框
  closeModal(): void {
    this.isOpenModal = false;
  }

  assignRole(data: any): void {
    this.nzModalService.create({
      nzTitle: '分配角色',
      nzWidth: 450,
      nzContent: RoleModalComponent,
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
    this.userService.resetPassword$(data.id).subscribe(data => {
      const { code, message, result } = data;
      if (Object.is(code, 0)) {
        this.message.create('success', message);
      } else {
        this.message.create('error', message);
      }
    })
  }

  // 删除用户
  deleteUser(data: any): void {
    this.userService.deleteUser$(data.id).subscribe(data => {
      const { code, message, result } = data;
      if (Object.is(code, 0)) {
        this.initUserList(this.searchData());
        this.message.create('success', message);
      } else {
        this.message.create('error', message);
      }
    })
  }
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
