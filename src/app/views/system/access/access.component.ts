import { Component, OnInit } from '@angular/core';
import { AccessService } from '@app/services/system/access/access.service';
import { ObjectType } from '@app/types';
import { NzMessageService } from 'ng-zorro-antd';

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
  ) { }

  async ngOnInit(): Promise<void> {
    const { data, total } = await this.initAccessList(this.searchData());
    this.tableTotal = total;
    this.tableList = data;
    this.loadData = false;
  }

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

  // 是否打开弹框
  isOpenModal: boolean = false;

  // 编辑数据传递到子组件中
  rowData: any = {};

  // 添加数据弹框
  addAccess(): void {
    this.rowData = {};
    this.isOpenModal = true;
  }

  // 子组件添加数据成功后请求数据
  saveSuccess(): void {
    this.isOpenModal = false;
    this.loadData = true;
    this.initAccessList(this.searchData());
  }

  // 关闭弹框
  closeModal(): void {
    this.isOpenModal = false;
    console.log(this.isOpenModal);
  }

  // 编辑
  editAccess(data: any): void {
    this.rowData = data;
    this.isOpenModal = true;
  }


  // 删除数据
  deleteRowData(rowData: ObjectType): void {
    this.accessService.deleteAccess$(rowData.id).subscribe(data => {
      const { code, message, result } = data;
      if (Object.is(code, 0)) {
        this.message.create('success', message);
        this.initAccessList(this.searchData());
      } else {
        this.message.create('error', message);
      }
    })
  }

  // 修改页面
  changePage(page: ObjectType) {

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


  // 设置搜索的条件
  private searchData(params?: ObjectType) {
    return {
      pageNum: 1,
      pageSize: 10,
      ...params,
    }
  }
}
