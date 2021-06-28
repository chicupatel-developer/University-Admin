import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentMyCrsMyAsmtsComponent } from './student-my-crs-my-asmts.component';

describe('StudentMyCrsMyAsmtsComponent', () => {
  let component: StudentMyCrsMyAsmtsComponent;
  let fixture: ComponentFixture<StudentMyCrsMyAsmtsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentMyCrsMyAsmtsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentMyCrsMyAsmtsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
