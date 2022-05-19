import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacultyEditComponent } from './faculty-edit.component';

describe('FacultyEditComponent', () => {
  let component: FacultyEditComponent;
  let fixture: ComponentFixture<FacultyEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacultyEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacultyEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
