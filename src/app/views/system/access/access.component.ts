import { Component, OnInit } from '@angular/core';
import { AccessService } from '@app/services/system/access/access.service';
import { ObjectType } from '@app/types';
import { TreeNodeInterface } from './table-type';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.scss']
})
export class AccessComponent implements OnInit {
  // 表格数据
  accessListData = [];
  // 数据加载中
  loadData: boolean = false;
  // 总共多少条数据
  // private tableTotal: number = 0;
  // // 当前页码
  // private pageNumber: number = 1;
  // // 默认一页显示多少条
  // private pageSize: number = 10;
  // // 页码可以选择一次展示多少条数据
  // private nzPageSizeOptions: number[] = [10, 20, 30, 40, 50];
  // 设置表格滚动条
  tableScroll: object = {
    x: '145%',
    y: document.body.offsetHeight - 220
  }
  mapOfExpandedData = {};
  constructor (
    private readonly accessService: AccessService,
    private readonly message: NzMessageService,
  ) { }

  collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
    console.log(array, data, $event)
    // 关闭的时候$event=false打开的时候为true
    if ($event === false) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.key === d.key)!;
          target.expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
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
          stack.push({ ...node.children[i], level: node.level! + 1, expand: false, parent: node });
        }
      }
    }
    return array;
  }

  visitNode(node: any, hashMap: { [key: string]: boolean }, array: any[]): void {
    if (!hashMap[node.key]) {
      hashMap[node.key] = true;
      array.push(node);
    }
  }

  ngOnInit(): void {
    this.initAccessList();
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

  // 页码改变触发事件
  // private changePageNumber(pageNumber: number): void {
  //   this.loadData = true;
  //   this.initAccessList({ pageNumber })
  // }

  // 页数改变触发事件
  // private changePageSize(pageSize: number): void {
  //   this.loadData = true;
  //   this.pageSize = pageSize;
  //   this.initAccessList({ pageSize })
  // }

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
  // 请求数据
  initAccessList(params?: ObjectType) {
    this.accessService.accessList$(params).subscribe(data => {
      const { code, message, result } = data;
      if (Object.is(code, 0)) {
        const data1 = result.map((item: any, index: number) => ({ ...item, key: (index + 1) }));
        this.accessListData = this.formatData(data1, 'sort');
        this.accessListData.forEach(item => {
          this.mapOfExpandedData[item.key] = this.convertTreeToList(item);
        });
        this.loadData = false;
      }
    })
  }
  formatHandler(data: any[]) {
    // 把当前数组边变成对象,以id为对象的key,值为当前数组的项
    return data.reduce((pre, cur) => {
      return { ...pre, [cur['id']]: cur }
    }, {});
  }
  // 格式化数据
  formatData(data: any[], sortField?: string): Array<ObjectType> {
    const formatObj = this.formatHandler(data);
    const sortArray = sortField ? data.sort((a, b) => a[sortField] - b[sortField]) : data;
    return sortArray.reduce((arr, cur) => {
      // 迭代当前数据的parentId存在就取存在的,不存在就取值-1
      const moduleId = cur.moduleId ? cur.moduleId : -1;
      const parent = formatObj[moduleId];
      // 迭代当前项存在父节点就判断如果有children的时候就追加,不然就创建一个children;如果当前没父节点就直接追加
      if (parent) {
        parent.children ? parent.children.push(cur) : parent.children = [cur];
      } else {
        arr.push(cur)
      }
      return arr;
    }, []);
  }
}
