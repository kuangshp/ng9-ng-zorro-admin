import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAccessComponent } from './edit-access.component';

describe('EditAccessComponent', () => {
  let component: EditAccessComponent;
  let fixture: ComponentFixture<EditAccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
