import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseRemoveComponent } from './course-remove.component';

describe('CourseRemoveComponent', () => {
  let component: CourseRemoveComponent;
  let fixture: ComponentFixture<CourseRemoveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseRemoveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseRemoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
