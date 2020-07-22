import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DictComponent } from './dict.component';

describe('DictComponent', () => {
  let component: DictComponent;
  let fixture: ComponentFixture<DictComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DictComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DictComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
