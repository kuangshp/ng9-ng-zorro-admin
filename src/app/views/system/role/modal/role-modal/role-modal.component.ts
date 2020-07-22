import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { ObjectType } from '@app/types';
import { RoleService } from '@app/services/system/role/role.service';

@Component({
  selector: 'app-role-modal',
  templateUrl: './role-modal.component.html',
  styleUrls: ['./role-modal.component.scss']
})
export class RoleModalComponent implements OnInit {
  validateForm: FormGroup;
  status: string = '1';

  // 接收父组件传递过来的行数据
  @Input() rowData: ObjectType = {};

  constructor (
    private fb: FormBuilder,
    private message: NzMessageService,
    private readonly roleService: RoleService,
  ) { }

  ngOnInit(): void {
    if (Object.keys(this.rowData).length) {
      const { title, status, description } = this.rowData;
      this.validateForm = this.fb.group({
        title: [title, [Validators.required]],
        status: [status],
        description: [description],
      });
    } else {
      this.validateForm = this.fb.group({
        title: ['', [Validators.required]],
        status: [''],
        description: [''],
      });
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

  // 提交数据到服务器端
  private async subData(postData: ObjectType) {
    // 编辑
    if (Object.keys(this.rowData).length) {
      const { id, ..._ } = this.rowData;
      const { code, message } = await this.roleService.updateRole$(id, postData).toPromise();
      if (Object.is(code, 0)) {
        this.message.create('success', message);
        return true;
      } else {
        this.message.create('error', message);
      }
    } else { // 新增
      const { code, message } = await this.roleService.createUserApi$(postData).toPromise();
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
