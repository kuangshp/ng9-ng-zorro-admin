import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { AccessService } from '@app/services/system/access/access.service';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-edit-access',
  templateUrl: './edit-access.component.html',
  styleUrls: ['./edit-access.component.scss']
})
export class EditAccessComponent implements OnInit {
  validateForm: FormGroup;
  isVisible: boolean = true;
  title: string = '添加资源';
  status: string = '1';
  isEdit: boolean = false;
  // 类型
  type: string = '1';
  // 请求方式
  method: string = 'GET';
  // 模块列表
  moduleList: any[] = [];

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
    private readonly accessService: AccessService,
  ) {
    this.validateForm = this.fb.group({
      type: [''],
      moduleName: ['', [Validators.required]],
      moduleId: ['-1', [Validators.required]],
      actionName: ['', [Validators.required]],
      url: ['',],
      method: [''],
      icon: ['',],
      status: [''],
      sort: ['1'],
      description: [''],
      platform: [''],
    });
  }

  ngOnInit() {
    if (Object.keys(this.rowData).length) {
      this.type = this.rowData.type + '';
      this.isEdit = true;
      // 单独处理下拉框
      this.status = this.rowData.status + '';
      this.method = this.rowData.method ? this.rowData.method.toUpperCase() : 'GET';
      this.title = '编辑权限';
      this.validateForm.patchValue(this.rowData);
    } else {
      this.validateForm.patchValue({
        title: '',
        description: '',
        status: '',
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
  // 确定按钮
  handleOk(): void {
    console.log(this.validateForm);
    console.log(this.validateForm.value);
    if (this.validateForm.valid) {
      const formData = this.validateForm.value;
      // 编辑数据
      if (Object.keys(this.rowData).length) {
        this.accessService.updateAccess$(this.rowData.id, formData).subscribe(data => {
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
        this.accessService.createAccessApi$(formData).subscribe(data => {
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
    // this.validateForm.reset();
    for (const key in this.validateForm.controls) {
      this.validateForm.controls[key].markAsPristine();
      this.validateForm.controls[key].updateValueAndValidity();
    }
  }

  // 获取模块信息
  initAccessParentList(type: string): void {
    this.accessService.accessParentList$(type).subscribe(data => {
      const { code, message, result } = data;
      if (Object.is(code, 0)) {
        this.moduleList = result;
      }
    })
  }
}
