import { Component, OnInit } from '@angular/core';
import { RoleService } from '@app/services/system/role/role.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AccessModalComponent } from './modal/access-modal/access-modal.component';
import { ObjectType } from '@app/types';
import { RoleModalComponent } from './modal/role-modal/role-modal.component';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

  // 表格数据
  tableList = [];
  // 数据加载中
  loadData: boolean = true;
  // 总共多少条数据
  tableTotal: number = 0;


  constructor (
    private roleService: RoleService,
    private message: NzMessageService,
    private readonly nzModalService: NzModalService,
  ) { }

  ngOnInit() {
    this.initRoleList();
  }

  // 添加数据弹框
  addRole(): void {
    this.nzModalService.create({
      nzTitle: '添加角色',
      nzContent: RoleModalComponent,
      nzComponentParams: {
        rowData: {},
      },
      nzOkText: '确认',
      nzCancelText: '取消',
      nzOnOk: async (componentInstance) => {
        const result = await componentInstance.handleOk();
        if (result) {
          this.initRoleList(this.searchData());
        }
        return result;
      }
    })
  }

  // 编辑角色
  editRole(rowData: ObjectType): void {
    this.nzModalService.create({
      nzTitle: '编辑角色',
      nzContent: RoleModalComponent,
      nzComponentParams: {
        rowData,
      },
      nzOkText: '确认',
      nzCancelText: '取消',
      nzOnOk: async (componentInstance) => {
        const result = await componentInstance.handleOk();
        if (result) {
          this.initRoleList(this.searchData());
        }
        return result;
      }
    })
  }

  // 给角色赋菜单权限
  menusAuth(data: any, type: string): void {
    console.log(data);
    this.openAccessModal('给角色分配菜单权限', data, type);
  }

  // 给角色赋接口权限
  interfaceAuth(data: any, type: string): void {
    this.openAccessModal('给角色分配接口权限', data, type);
  }

  // 分配权限的弹框
  openAccessModal(title: string, data: any, type: string): void {
    this.nzModalService.create({
      nzTitle: title,
      nzContent: AccessModalComponent,
      nzComponentParams: {
        roleId: data.id,
        type,
      },
      nzOnOk: async (componentInstance) => { // 保存
        return await componentInstance.handleOk();
      }
    })
  }
  // 子组件添加数据成功后请求数据
  saveSuccess(): void {
    this.loadData = true;
    this.initRoleList();
  }

  // 关闭弹框
  closeModal(): void {
  }

  // 获取角色列表
  initRoleList(params?: object) {
    this.roleService.roleListApi$(params).subscribe(data => {
      const { code, message, result } = data;
      if (Object.is(code, 0)) {
        this.loadData = false;
        this.tableList = result.data;
        this.tableTotal = result.total;
      } else {
        console.log(message);
      }
    })
  }

  // 删除角色
  deleteRowData(data: any): void {
    this.roleService.delete$(data.id).subscribe(data => {
      const { code, message, result } = data;
      if (Object.is(code, 0)) {
        this.initRoleList(this.searchData());
        this.message.create('success', message);
      } else {
        this.message.create('error', message);
      }
    })
  }
  changePage(params: ObjectType) {
    this.loadData = true;
    this.initRoleList(this.searchData(params));
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
