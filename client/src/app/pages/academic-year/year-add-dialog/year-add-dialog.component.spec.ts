import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearAddDialogComponent } from './year-add-dialog.component';

describe('YearAddDialogComponent', () => {
  let component: YearAddDialogComponent;
  let fixture: ComponentFixture<YearAddDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [YearAddDialogComponent]
    });
    fixture = TestBed.createComponent(YearAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
