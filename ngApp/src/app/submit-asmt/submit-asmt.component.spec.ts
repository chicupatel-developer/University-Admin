import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitAsmtComponent } from './submit-asmt.component';

describe('SubmitAsmtComponent', () => {
  let component: SubmitAsmtComponent;
  let fixture: ComponentFixture<SubmitAsmtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmitAsmtComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitAsmtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
