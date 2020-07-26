import { Component, OnInit } from '@angular/core';
import { ObjectType } from '@app/types';
import { DictService } from '@app/services/system/dict/dict.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { DictModalComponent } from './modal/dict-modal/dict-modal.component';

@Component({
  selector: 'app-dict',
  templateUrl: './dict.component.html',
  styleUrls: ['./dict.component.scss']
})
export class DictComponent implements OnInit {
  // 表格数据
  tableList = [];
  // 数据加载中
  loadData: boolean = true;
  // 总共多少条数据
  tableTotal: number = 0;
  constructor (
    private readonly dictService: DictService,
    private readonly message: NzMessageService,
    private readonly nzModalService: NzModalService,
    private readonly modal: NzModalService,
  ) { }

  ngOnInit(): void {
    this.initDictList(this.searchData());
  }
  add() {
    this.nzModalService.create({
      nzTitle: '新增字典',
      nzContent: DictModalComponent,
      nzComponentParams: {
        rowData: {},
      },
      nzOnOk: async (componentInstance) => {
        const result = await componentInstance.handleOk();
        if (result) {
          this.initDictList(this.searchData());
        }
        return result;
      }
    })
  }
  delete(rowData: ObjectType) {
    this.modal.confirm({
      nzTitle: '删除提示?',
      nzContent: `<b style="color: red;">是否要删除字典${rowData.value}</b>`,
      nzOkText: '确认',
      nzOkType: 'danger',
      nzOnOk: () => {
        this.dictService.delDict$(rowData.id).subscribe(data => {
          const { code, message } = data;
          if (Object.is(code, 0)) {
            this.message.create('success', message);
            this.initDictList(this.searchData());
          } else {
            this.message.create('error', message);
          }
        })
      },
      nzCancelText: '取消',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  edit(rowData: ObjectType) {
    this.nzModalService.create({
      nzTitle: '编辑字典',
      nzContent: DictModalComponent,
      nzComponentParams: {
        rowData: rowData,
      },
      nzOnOk: async (componentInstance) => {
        const result = await componentInstance.handleOk();
        if (result) {
          this.initDictList(this.searchData());
        }
        return result;
      }
    })
  }

  changePage(params: ObjectType) {
    this.loadData = true;
    this.initDictList(this.searchData(params));
  }

  private initDictList(params?: object): void {
    this.dictService.dictList$(params).subscribe(response => {
      const { code, message, result: { data, total } } = response;
      if (Object.is(code, 0)) {
        this.tableList = data;
        this.tableTotal = total;
        this.loadData = false;
      } else {
        console.error(message);
      }
    })
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
