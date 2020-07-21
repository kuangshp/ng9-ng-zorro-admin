import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { Observer, Observable, Subject } from 'rxjs';
import { ValidatorsMobile } from '@app/validators';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { RoleService } from '@app/services/system/role/role.service';
import { UserService } from '@app/services/system/user/user.service';
import { debounceTime, distinctUntilChanged, switchMap, map, first } from 'rxjs/operators';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  validateForm: FormGroup;
  isVisible: boolean = true;
  roleList: Array<object> = [];
  title: string = '添加用户';
  status: string = '1';
  isSuper: string = '0';
  isEdit: boolean = false;


  // 接收父组件传递过来的行数据
  @Input() rowData?: any;
  // 表示对外输出一个saveSuccess事件
  @Output() private saveSuccess = new EventEmitter<null>();
  // 通知父组件关闭弹框
  @Output() private closeModal = new EventEmitter<null>();

  constructor (
    private fb: FormBuilder,
    private message: NzMessageService,
    private modalService: NzModalService,
    private readonly userService: UserService,
    private readonly roleService: RoleService) {
    this.validateForm = this.fb.group({
      username: ['', [Validators.required]],
      // username: ['', [Validators.required], [this.userNameAsyncValidator]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.email]],
      mobile: ['', [ValidatorsMobile]],
      status: [''],
      platform: [''],
      is_super: [''],
    });
  }

  ngOnInit() {
    this.initRoleList();
    if (Object.keys(this.rowData).length) {
      console.log(this.rowData, '??');
      this.isEdit = true;
      // 单独处理下拉框
      this.status = this.rowData.status + '';
      this.isSuper = this.rowData.is_super + '';
      this.title = '编辑用户';
      delete this.validateForm.controls.password;
      this.validateForm.patchValue(this.rowData);
    } else {
      this.validateForm.patchValue({
        username: '',
        password: '',
        email: '',
        mobile: '',
        status: '',
        platform: '',
        is_super: '',
      })
    }
  }

  // 确定按钮
  handleOk(): void {
    if (this.validateForm.valid) {
      const formData = this.validateForm.value;
      // 编辑数据
      if (Object.keys(this.rowData).length) {
        this.userService.updateUser$(this.rowData.id, formData).subscribe(data => {
          const { code, message, result } = data;
          if (Object.is(code, 0)) {
            this.resetForm();
            this.saveSuccess.emit();
            this.message.create('success', message);
          } else {
            this.message.create('error', message);
          }
        })
      } else {
        // 创建数据
        this.userService.createUserApi$(formData).subscribe(data => {
          const { code, message, result } = data;
          if (Object.is(code, 0)) {
            this.resetForm();
            this.saveSuccess.emit();
            this.message.create('success', message);
          } else {
            this.message.create('error', message);
          }
        })
      }
    } else {
      this.message.create('error', '数据校验不合格');
    }
  }

  // 关闭弹框
  handleCancel(): void {
    // 如果修改了数据提示是否要关闭
    if (this.validateForm.dirty) {
      this.modalService.confirm({
        nzTitle: '<h4>关闭提示</h4>',
        nzContent: '<b>你修改的数据还没提交,确定要关闭吗?</b>',
        nzOnOk: () => {
          this.resetForm();
          this.closeModal.emit();
        }
      });
    } else {
      this.resetForm();
      this.closeModal.emit();
    }
  }
  // 远程异步校验用户名是否存在
  userNameAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<ValidationErrors | null>) => {
      control.valueChanges.pipe(
        //防抖时间，单位毫秒
        debounceTime(300),
        // 忽视前一次搜索内容相同的数据
        distinctUntilChanged(),
        // 当搜索变更的时候切换到新的搜索
        switchMap(() => this.userService.searchApi$({ username: control.value }))
      ).subscribe(data => {
        const { code, result } = data;
        if (Object.is(code, 0) && result) {
          observer.next({ error: true, duplicated: true });
        } else {
          observer.next(null);
        }
        observer.complete();
      })
    });

  // 重置表格数据
  resetForm(): void {
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
  }
  // 获取全部的角色列表
  initRoleList(): void {
    this.roleService.roleListApi$().subscribe(data => {
      const { code, result } = data;
      if (Object.is(code, 0)) {
        this.roleList = result.data;
      }
    })
  }
}
