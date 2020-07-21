import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgZorroAntdModule } from 'ng-zorro-antd';
import { PipesModule } from '@app/pipes/pipes.module';
import { DanceboxTableComponent } from './components/dancebox-table/dancebox-table.component';

@NgModule({
  declarations: [
    DanceboxTableComponent
  ],
  imports: [
    PipesModule,
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    PipesModule,
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    DanceboxTableComponent,
  ]
})
export class SharedModule { }
