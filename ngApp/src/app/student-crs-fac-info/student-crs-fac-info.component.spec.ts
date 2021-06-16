import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCrsFacInfoComponent } from './student-crs-fac-info.component';

describe('StudentCrsFacInfoComponent', () => {
  let component: StudentCrsFacInfoComponent;
  let fixture: ComponentFixture<StudentCrsFacInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentCrsFacInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentCrsFacInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
