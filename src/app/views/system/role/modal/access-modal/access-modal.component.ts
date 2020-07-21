import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccessService } from '@app/services/system/access/access.service';
import { MenusService } from '@app/services/menus/menus.service';
import { NzTreeComponent, TransferItem, NzTreeNode, TransferChange, NzMessageService } from 'ng-zorro-antd';
import { RoleService } from '@app/services/system/role/role.service';
import { Observable, of, Observer } from 'rxjs';

@Component({
  selector: 'app-access-modal',
  templateUrl: './access-modal.component.html',
  styleUrls: ['./access-modal.component.scss']
})
export class AccessModalComponent implements OnInit {
  @Input() roleId: string;
  @Input() type: string;

  list: any[] = []
  treeData //= this.generateTree(this.list);
  checkedNodeList: NzTreeNode[] = [];

  constructor (
    private readonly accessService: AccessService,
    private readonly roleService: RoleService,
    private readonly message: NzMessageService,
  ) { }
  ngOnInit(): void {
    this.authorizationList();
  }

  authorizationList(): void {
    this.accessService.authorizationList$(this.type, this.roleId).subscribe(data => {
      const { code, message, result } = data;
      if (Object.is(code, 0)) {
        this.list = result.map((it: any) => {
          if (it.parentid <= 0) {
            return {
              ...it,
              parentid: it.parentid < 0 ? 0 : it.parentid,
            }
          } else {
            return {
              ...it,
              isLeaf: true
            }
          }
        })
        console.log(JSON.stringify(this.list));
        this.treeData = this.generateTree(this.list);
      }
    })
  }
  @ViewChild('tree', { static: true }) tree: NzTreeComponent;


  generateTree(arr: TransferItem[]): TransferItem[] {
    const tree: TransferItem[] = [];
    const mappedArr: any = {};
    let arrElem: TransferItem;
    let mappedElem: TransferItem;

    for (let i = 0, len = arr.length; i < len; i++) {
      arrElem = arr[i];
      mappedArr[arrElem.id] = { ...arrElem };
      mappedArr[arrElem.id].children = [];
    }

    for (const id in mappedArr) {
      if (mappedArr.hasOwnProperty(id)) {
        mappedElem = mappedArr[id];
        if (mappedElem.parentid) {
          mappedArr[mappedElem.parentid].children.push(mappedElem);
        } else {
          tree.push(mappedElem);
        }
      }
    }
    return tree;
  }

  checkBoxChange(node: NzTreeNode, onItemSelect: (item: TransferItem) => void): void {
    if (node.isDisabled) {
      return;
    }
    node.isChecked = !node.isChecked;
    if (node.isChecked) {
      this.checkedNodeList.push(node);
    } else {
      const idx = this.checkedNodeList.indexOf(node);
      if (idx !== -1) {
        this.checkedNodeList.splice(idx, 1);
      }
    }
    const item = this.list.find(w => w.id === node.origin.id);
    onItemSelect(item!);
  }

  change(ret: TransferChange): void {
    const isDisabled = ret.to === 'right';
    this.checkedNodeList.forEach(node => {
      node.isDisabled = isDisabled;
      node.isChecked = isDisabled;
    });
  }

  handleOk(): Promise<any> {
    return new Promise((resolve, reject) => {
      const selectedAccessList = this.list.filter(item => item.direction === 'right').map(item => item.id);
      let postData = {
        roleId: this.roleId,
        type: this.type,
        accessList: selectedAccessList
      }
      // 提交分配权限
      this.roleService.assiginAccess$(postData).subscribe(data => {
        const { code, message, result } = data;
        if (Object.is(code, 0)) {
          this.message.create('success', message);
          resolve(true);
        } else {
          this.message.create('error', message);
          reject(false);
        }
      });
    })
  }
  // new Observable((observer: Observer<boolean>) => {
  //   const selectedAccessList = this.list.filter(item => item.direction === 'right').map(item => item.id);
  //   let postData = {
  //     roleId: this.roleId,
  //     type: this.type,
  //     accessList: selectedAccessList
  //   }

  //   this.roleService.assiginAccess$(postData).subscribe(data => {
  //     const { code, message, result } = data;
  //     if (Object.is(code, 0)) {
  //       this.message.create('success', message);
  //       observer.next(true);
  //     } else {
  //       this.message.create('error', message);
  //       observer.next(false);
  //     }
  //     observer.complete();
  //   });
  // })
}
