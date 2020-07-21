import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { RoleService } from '@app/services/system/role/role.service';

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.scss']
})
export class EditRoleComponent implements OnInit {
  validateForm: FormGroup;
  isVisible: boolean = true;
  title: string = '添加用户';
  status: string = '1';
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
    private readonly roleService: RoleService,
  ) {
    this.validateForm = this.fb.group({
      title: ['', [Validators.required]],
      status: [''],
      description: [''],
    });
  }

  ngOnInit() {
    if (Object.keys(this.rowData).length) {
      this.isEdit = true;
      // 单独处理下拉框
      this.status = this.rowData.status + '';
      this.title = '编辑角色';
      delete this.validateForm.controls.title;
      this.validateForm.patchValue(this.rowData);
    } else {
      this.validateForm.patchValue({
        title: '',
        description: '',
        status: '',
      })
    }
  }

  // 确定按钮
  handleOk(): void {
    if (this.validateForm.valid) {
      const formData = this.validateForm.value;
      // 编辑数据
      if (Object.keys(this.rowData).length) {
        this.roleService.updateRole$(this.rowData.id, formData).subscribe(data => {
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
        this.roleService.createUserApi$(formData).subscribe(data => {
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

  // 重置表格数据
  resetForm(): void {
    this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
  }
}
