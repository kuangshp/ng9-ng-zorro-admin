import { Component, OnInit } from '@angular/core';
import { AccessService } from '@app/services/system/access/access.service';
import { ObjectType } from '@app/types';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { EditAccessComponent } from './modal/edit-access/edit-access.component';

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.scss']
})
export class AccessComponent implements OnInit {
  tableList: ObjectType[] = [];
  tableTotal: number = 0;
  loadData: boolean = false;

  constructor (
    private readonly accessService: AccessService,
    private readonly message: NzMessageService,
    private readonly nzModalService: NzModalService,
  ) { }

  ngOnInit(): void {
    this.tableValue(this.searchData());
  }

  // 点击行前面的➕号显示与隐藏表格的数据
  async changeRow(rowData: ObjectType, $event: boolean) {
    let type = rowData.type;
    const { data } = await this.initAccessList({ pageSize: 100, id: rowData.id, type: ++type });
    if ($event) {
      // 根据当前的id去查询位置并且添加数据
      const index = this.tableList.findIndex((item: ObjectType) => item.id === rowData.id);
      this.tableList.splice((index + 1), 0, ...data);
      this.tableList = [...this.tableList];
    } else {
      // 移除对应的数据
      const ids = data.map((item: ObjectType) => item.id);
      this.tableList = this.tableList.filter(item => !ids.includes(item.id));
    }
  }

  // 添加数据弹框
  addAccess(): void {
    this.nzModalService.create({
      nzTitle: '新增资源',
      nzContent: EditAccessComponent,
      nzOnOk: async (componentInstance) => { // 保存
        const result = await componentInstance.handleOk();
        if (result) {
          this.tableValue(this.searchData());
        }
        return result;
      }
    })
  }


  // 编辑
  editAccess(rowData: ObjectType): void {
    this.nzModalService.create({
      nzTitle: '编辑资源',
      nzContent: EditAccessComponent,
      nzComponentParams: {
        rowData,
      },
      nzOnOk: async (componentInstance) => { // 保存
        const result = await componentInstance.handleOk();
        if (result) {
          this.tableValue(this.searchData());
        }
        return result;
      }
    })
  }


  // 删除数据
  deleteRowData(rowData: ObjectType): void {
    this.accessService.deleteAccess$(rowData.id).subscribe(data => {
      const { code, message } = data;
      if (Object.is(code, 0)) {
        this.message.create('success', message);
        this.tableValue(this.searchData());
      } else {
        this.message.create('error', message);
      }
    })
  }

  // 修改页面
  changePage(page: ObjectType) {
    console.log(page);
    this.tableValue(this.searchData(page));
  }

  // 初始化数据
  private async initAccessList(params?: ObjectType) {
    const { code, message, result: { data, total } } = await this.accessService.accessList$(params).toPromise();
    if (Object.is(code, 0)) {
      return { data, total };
    } else {
      console.log(message);
    }
  }

  // 给表格数据赋值(这个组件有点特殊)
  private async tableValue(params: ObjectType) {
    const { data, total } = await this.initAccessList(params);
    this.tableTotal = total;
    this.tableList = data;
    this.loadData = false;
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
