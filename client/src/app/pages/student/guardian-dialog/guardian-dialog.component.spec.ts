import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuardianDialogComponent } from './guardian-dialog.component';

describe('GuardianDialogComponent', () => {
  let component: GuardianDialogComponent;
  let fixture: ComponentFixture<GuardianDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GuardianDialogComponent]
    });
    fixture = TestBed.createComponent(GuardianDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
