import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleModalComponent } from './role-modal.component';

describe('RoleModalComponent', () => {
  let component: RoleModalComponent;
  let fixture: ComponentFixture<RoleModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
