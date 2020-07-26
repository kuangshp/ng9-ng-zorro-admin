import { Component, OnInit, Input } from '@angular/core';
import { ObjectType } from '@app/types';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { DictService } from '@app/services/system/dict/dict.service';

@Component({
  selector: 'app-dict-modal',
  templateUrl: './dict-modal.component.html',
  styleUrls: ['./dict-modal.component.scss']
})
export class DictModalComponent implements OnInit {
  validateForm: FormGroup;

  // 接收父组件传递过来的行数据
  @Input() rowData: ObjectType = {};
  constructor (
    private fb: FormBuilder,
    private readonly message: NzMessageService,
    private readonly dictService: DictService,
  ) { }

  ngOnInit(): void {
    if (Object.keys(this.rowData).length) {
      const { label, category, description } = this.rowData;
      this.validateForm = this.fb.group({
        label: [label, [Validators.required]],
        category: [category, Validators.required],
        description: [description]
      })
    } else {
      this.validateForm = this.fb.group({
        label: ['', [Validators.required]],
        category: ['', Validators.required],
        description: ['']
      })
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
      const { code, message } = await this.dictService.updateDict$(id, postData).toPromise();
      if (Object.is(code, 0)) {
        this.message.create('success', message);
        return true;
      } else {
        this.message.create('error', message);
      }
    } else { // 新增
      const { code, message } = await this.dictService.addDict$(postData).toPromise();
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
