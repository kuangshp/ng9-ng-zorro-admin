import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ObjectType } from '@app/types';
import { NzMessageService } from 'ng-zorro-antd';
import { ValidatorsMobile } from '@app/validators';
import { UserService } from '@app/services/system/user/user.service';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss']
})
export class UserModalComponent implements OnInit {
  validateForm: FormGroup;
  roleList: Array<object> = [];
  isEdit: boolean = false;
  status: string = '1';
  isSuper: string = '0';

  // 接收父组件传递过来的行数据
  @Input() rowData: ObjectType = {};

  constructor (
    private fb: FormBuilder,
    private message: NzMessageService,
    private readonly userService: UserService,
  ) { }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.email]],
      platform: [''],
      mobile: ['', [ValidatorsMobile]],
      status: [''],
      isSuper: [''],
    });
    if (Object.keys(this.rowData).length) {
      this.isEdit = true;
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
      const { code, message } = await this.userService.updateUser$(id, postData).toPromise();
      if (Object.is(code, 0)) {
        this.message.create('success', message);
        return true;
      } else {
        this.message.create('error', message);
      }
    } else { // 新增
      const { code, message } = await this.userService.createUserApi$(postData).toPromise();
      if (Object.is(code, 0)) {
        this.message.create('success', message);
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
