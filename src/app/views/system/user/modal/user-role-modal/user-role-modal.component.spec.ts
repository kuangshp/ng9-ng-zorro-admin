import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRoleModalComponent } from './user-role-modal.component';

describe('UserRoleModalComponent', () => {
  let component: UserRoleModalComponent;
  let fixture: ComponentFixture<UserRoleModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRoleModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRoleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
