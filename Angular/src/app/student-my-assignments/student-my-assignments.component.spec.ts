import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentMyAssignmentsComponent } from './student-my-assignments.component';

describe('StudentMyAssignmentsComponent', () => {
  let component: StudentMyAssignmentsComponent;
  let fixture: ComponentFixture<StudentMyAssignmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentMyAssignmentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentMyAssignmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
