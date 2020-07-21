import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DanceboxTableComponent } from './dancebox-table.component';

describe('DanceboxTableComponent', () => {
  let component: DanceboxTableComponent;
  let fixture: ComponentFixture<DanceboxTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DanceboxTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DanceboxTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
