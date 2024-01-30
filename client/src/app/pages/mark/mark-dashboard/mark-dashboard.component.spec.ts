import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkDashboardComponent } from './mark-dashboard.component';

describe('MarkDashboardComponent', () => {
  let component: MarkDashboardComponent;
  let fixture: ComponentFixture<MarkDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MarkDashboardComponent]
    });
    fixture = TestBed.createComponent(MarkDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
