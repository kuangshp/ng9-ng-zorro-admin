import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { UserService } from '@app/services/user/user.service';
import { ObjectType } from '@app/types';

@Component({
  selector: 'app-modify-password',
  templateUrl: './modify-password.component.html',
  styleUrls: ['./modify-password.component.scss']
})
export class ModifyPasswordComponent implements OnInit {
  validateForm: FormGroup;

  constructor (
    private fb: FormBuilder,
    private message: NzMessageService,
    private readonly userService: UserService,
  ) {
    this.validateForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(3)]],
      newPassword: ['', [Validators.required]],
      checkPassword: ['', [Validators.required, this.confirmationValidator]],
    });
  }

  ngOnInit() {
  }

  handleOk() {
    this.markAsDirty();
    if (this.validateForm.valid) {
      return this.subData(this.validateForm.value);
    } else {
      return false;
    }
  }

  updateConfirmValidator(): void {
    Promise.resolve().then(() => this.validateForm.controls.checkPassword.updateValueAndValidity());
  }

  // 校验两次密码是否为一致
  confirmationValidator = (control: FormControl): ObjectType | null => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.newPassword.value) {
      return { confirm: true, error: true };
    }
    return null;
  };

  // 提交数据
  private async subData(postData: ObjectType): Promise<boolean | null> {
    const { code, message } = await this.userService.modifyPassword$(postData).toPromise();
    if (Object.is(code, 0)) {
      this.message.create('success', message);
      return true;
    } else {
      this.message.create('error', message);
    }
  }

  // 数据校验提示错误信息
  private markAsDirty(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }
}
