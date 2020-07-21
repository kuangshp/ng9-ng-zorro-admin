import { Component, OnInit } from '@angular/core';
import { RoleService } from '@app/services/system/role/role.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { AccessModalComponent } from './modal/access-modal/access-modal.component';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {

  constructor (
    private roleService: RoleService,
    private message: NzMessageService,
    private readonly nzModalService: NzModalService,
  ) { }
  // 表格数据
  roleListData = [];
  // 数据加载中
  loadData: boolean = true;
  // 总共多少条数据
  tableTotal: number = 0;
  // 当前页码
  pageNumber: number = 1;
  // 默认一页显示多少条
  pageSize: number = 10;
  // 页码可以选择一次展示多少条数据
  nzPageSizeOptions: number[] = [10, 20, 30, 40, 50];
  // 设置表格滚动条
  tableScroll: object = {
    x: '105%',
    y: document.body.offsetHeight - 220
  }

  // 是否打开编辑角色、添加角色弹框
  isOpenModal: boolean = false;
  // 权限弹框
  isOpenAuthModal: boolean = false;

  // 编辑数据传递到子组件中
  rowData: any = {};

  ngOnInit() {
    this.initRoleList();
  }

  // 添加数据弹框
  addRole(): void {
    this.rowData = {};
    this.isOpenModal = true;
  }

  // 编辑角色
  editRole(data: any): void {
    this.rowData = data;
    this.isOpenModal = true;
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
    this.isOpenModal = false;
    this.loadData = true;
    this.initRoleList();
  }

  // 关闭弹框
  closeModal(): void {
    this.isOpenModal = false;
  }

  // 获取角色列表
  initRoleList(params?: object) {
    this.roleService.roleListApi$(params).subscribe(data => {
      const { code, message, result } = data;
      if (Object.is(code, 0)) {
        this.loadData = false;
        this.roleListData = result.data;
        this.tableTotal = result.total;
        this.pageNumber = result.pageNumber;
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
        this.initRoleList({ pageNumber: this.pageNumber, pageSize: this.pageSize });
        this.message.create('success', message);
      } else {
        this.message.create('error', message);
      }
    })
  }
  // 页码改变触发事件
  changePageNumber(pageNumber: number): void {
    this.loadData = true;
    this.initRoleList({ pageNumber })
  }

  // 页数改变触发事件
  changePageSize(pageSize: number): void {
    this.loadData = true;
    this.pageSize = pageSize;
    this.initRoleList({ pageSize })
  }
}
