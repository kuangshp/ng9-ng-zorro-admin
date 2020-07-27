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
  // 当前页码
  pageNum: number = 1;
  // 默认一页显示多少条
  pageSize: number = 10;
  // 页码可以选择一次展示多少条数据
  nzPageSizeOptions: number[] = [10, 20, 30, 40, 50];
  // 设置表格滚动条
  tableScroll: ObjectType = { x: '500px' };

  tableList: ObjectType[] = [];
  tableTotal: number = 0;
  loadData: boolean = false;

  mapOfExpandedData = {};
  constructor (
    private readonly accessService: AccessService,
    private readonly message: NzMessageService,
  ) { }

  async collapse(
    array: ObjectType[],
    key: number,
    rowData: ObjectType,
    $event: boolean): Promise<void> {
    console.log(array, key, rowData, $event)
    // 关闭的时候$event=false,打开的时候为true
    if (!$event) {
      if (rowData.children) {
        rowData.children.forEach(d => {
          const target = array.find(a => a.key === d.key)!;
          target.expand = false;
          this.collapse(array, key, target, false);
        });
      } else {
        return;
      }
    } else {
      // 打开的时候根据现在的type获取下一层级别的type
      const type = ++rowData.type;
      const moduleId = rowData.id;
      const { data, total } = await this.initAccessList({ type, pageSize: 100, moduleId });
      let newData = data.map((item: ObjectType) => {
        return {
          ...item,
          level: item.type,
          expand: false,
        }
      })
      // 在this.mapOfExpandedData[key]中查找到当前的数组位置
      const index = this.mapOfExpandedData[key].findIndex(item => item.id = rowData.id);
      console.log(index, '44', this.mapOfExpandedData[key].splice(key, 0, ...newData));
      this.mapOfExpandedData[key] = [
        ...this.mapOfExpandedData[key],
      ]
    }
  }

  convertTreeToList(root: any): any[] {
    const stack: any[] = [];
    const array: any[] = [];
    const hashMap = {};
    stack.push({ ...root, level: 0, expand: false });
    while (stack.length !== 0) {
      const node = stack.pop();
      this.visitNode(node, hashMap, array);
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({
            ...node.children[i],
            level: node.level! + 1,
            expand: false,
            parent: node
          });
        }
      }
    }
    return array;
  }

  visitNode(
    node: any,
    hashMap: { [key: string]: boolean },
    array: any[]
  ): void {
    if (!hashMap[node.key]) {
      hashMap[node.key] = true;
      array.push(node);
    }
  }

  async ngOnInit(): Promise<void> {
    const { data, total } = await this.initAccessList();
    this.tableTotal = total;
    this.tableList = data.map(item => {
      return {
        ...item,
        expand: false,
      }
    });
    this.tableList.forEach(item => {
      this.mapOfExpandedData[item.id] = this.convertTreeToList(item);
    })
    this.loadData = false;
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
    this.initAccessList();
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
  deleteRowData(data): void {
    this.accessService.deleteAccess$(data.id).subscribe(data => {
      const { code, message, result } = data;
      if (Object.is(code, 0)) {
        this.message.create('success', message);
        this.initAccessList();
      } else {
        this.message.create('error', message);
      }
    })
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

  // 页码改变触发事件
  changePageNumber(pageNum: number): void {
    this.pageNum = pageNum;
  }

  // 页数改变触发事件
  changePageSize(pageSize: number): void {
    this.pageSize = pageSize;
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
