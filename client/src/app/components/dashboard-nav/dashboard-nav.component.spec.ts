import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardNavComponent } from './dashboard-nav.component';

describe('DashboardNavComponent', () => {
  let component: DashboardNavComponent;
  let fixture: ComponentFixture<DashboardNavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardNavComponent]
    });
    fixture = TestBed.createComponent(DashboardNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
