import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessModalComponent } from './access-modal.component';

describe('AccessModalComponent', () => {
  let component: AccessModalComponent;
  let fixture: ComponentFixture<AccessModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
