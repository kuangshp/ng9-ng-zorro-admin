import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ObjectType } from '@app/types';

@Component({
  selector: 'app-dancebox-table',
  templateUrl: './dancebox-table.component.html',
  styleUrls: ['./dancebox-table.component.scss']
})
export class DanceboxTableComponent implements OnInit {
  // 当前页码
  pageNum: number = 1;
  // 默认一页显示多少条
  pageSize: number = 10;
  // 页码可以选择一次展示多少条数据
  nzPageSizeOptions: number[] = [10, 20, 30, 40, 50];
  // 设置表格滚动条
  tableScroll: ObjectType = { x: '500px' };

  // 定义父组件传递过来的数据
  @Input()
  tableDataList: ObjectType[] = [];
  @Input()
  tableTotal: number = 0;
  @Input()
  loadData: boolean = false;

  // 子组件更改页码的时候通知父组件
  @Output()
  changePage: EventEmitter<ObjectType> = new EventEmitter();

  ngOnInit(): void {
  }

  // 页码改变触发事件
  changePageNumber(pageNum: number): void {
    this.pageNum = pageNum;
    this.changePage.emit(this.searchData());
  }

  // 页数改变触发事件
  changePageSize(pageSize: number): void {
    this.pageSize = pageSize;
    this.changePage.emit(this.searchData());
  }

  // 设置搜索的条件
  private searchData(): ObjectType {
    return {
      pageSize: this.pageSize,
      pageNum: this.pageNum,
    }
  }
}
