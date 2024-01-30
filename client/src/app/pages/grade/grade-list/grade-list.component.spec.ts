import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeListComponent } from './grade-list.component';

describe('GradeListComponent', () => {
  let component: GradeListComponent;
  let fixture: ComponentFixture<GradeListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GradeListComponent]
    });
    fixture = TestBed.createComponent(GradeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
