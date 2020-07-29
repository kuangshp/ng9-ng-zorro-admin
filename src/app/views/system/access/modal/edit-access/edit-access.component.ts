import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { AccessService } from '@app/services/system/access/access.service';
import { NzMessageService } from 'ng-zorro-antd';
import { ObjectType } from '@app/types';

@Component({
  selector: 'app-edit-access',
  templateUrl: './edit-access.component.html',
  styleUrls: ['./edit-access.component.scss']
})
export class EditAccessComponent implements OnInit {
  validateForm: FormGroup;
  isEdit: boolean = false;
  // 类型
  type: string = '1';
  // 模块列表
  moduleList: any[] = [];

  // 接收父组件传递过来的行数据
  @Input() rowData: ObjectType = {};

  constructor (
    private fb: FormBuilder,
    private message: NzMessageService,
    private readonly accessService: AccessService,
  ) {
    this.validateForm = this.fb.group({
      type: [''],
      moduleName: ['', [Validators.required]],
      moduleId: ['-1', [Validators.required]],
      actionName: ['', [Validators.required]],
      url: ['',],
      method: ['GET'],
      icon: ['',],
      status: ['1'],
      sort: ['1'],
      description: [''],
    });
  }

  ngOnInit() {
    if (Object.keys(this.rowData).length) {
      this.type = this.rowData.type + '';
      this.isEdit = true;
      // 单独处理下拉框
      this.validateForm.patchValue({ ...this.rowData, status: this.rowData.status + '' });
    } else {
      this.validateForm.patchValue({
        title: '',
        description: '',
        status: '1',
      })
    }
  }

  // 修改模块类型的事件
  typeChange(type: string): void {
    this.type = type;
    if (type == '1') {
      this.validateForm.removeControl('actionName');
      this.validateForm.addControl('moduleName', new FormControl());
      // this.validateForm.removeControl('url');
    } else if (type == '2') {
      this.initAccessParentList('1');
      this.validateForm.removeControl('moduleName');
      this.validateForm.addControl('actionName', new FormControl());
      // this.validateForm.addControl('url', new FormControl());
    } else { // 操作的时候获取对应的路由
      this.initAccessParentList('2');
      this.validateForm.removeControl('moduleName');
      this.validateForm.addControl('actionName', new FormControl());
      this.validateForm.addControl('method', new FormControl());
    }
  }

  // 成功按钮的回调
  handleOk() {
    this.markAsDirty();
    if (this.validateForm.valid) {
      return this.subData(this.validateForm.value);
    } else {
      return false;
    }
  }

  // 获取模块信息
  private initAccessParentList(type: string): void {
    this.accessService.accessParentList$(type).subscribe(data => {
      const { code, message, result } = data;
      if (Object.is(code, 0)) {
        this.moduleList = result;
      } else {
        console.error(message);
      }
    })
  }

  // 提交数据到服务器端
  private async subData(postData: ObjectType) {
    // 编辑
    if (Object.keys(this.rowData).length) {
      const { id, ..._ } = this.rowData;
      const { code, message } = await this.accessService.updateAccess$(id, postData).toPromise();
      if (Object.is(code, 0)) {
        this.message.create('success', message);
        return true;
      } else {
        this.message.create('error', message);
      }
    } else { // 新增
      const { code, message } = await this.accessService.createAccessApi$(postData).toPromise();
      if (Object.is(code, 0)) {
        this.message.create('success', message);
        return true;
      } else {
        this.message.create('error', message);
      }
    }
  }

  private markAsDirty(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }
}
