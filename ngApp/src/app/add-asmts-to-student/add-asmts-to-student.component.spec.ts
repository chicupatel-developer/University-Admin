import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAsmtsToStudentComponent } from './add-asmts-to-student.component';

describe('AddAsmtsToStudentComponent', () => {
  let component: AddAsmtsToStudentComponent;
  let fixture: ComponentFixture<AddAsmtsToStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAsmtsToStudentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAsmtsToStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
