import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacultyRemoveComponent } from './faculty-remove.component';

describe('FacultyRemoveComponent', () => {
  let component: FacultyRemoveComponent;
  let fixture: ComponentFixture<FacultyRemoveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacultyRemoveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacultyRemoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
