import { Component, Inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import * as moment from 'moment';
import { DATE_YEAR_FORMAT } from 'src/app/utils/validators';

@Component({
  selector: 'app-year-add-dialog',
  templateUrl: './year-add-dialog.component.html',
  styleUrls: ['./year-add-dialog.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: DATE_YEAR_FORMAT },
  ],
})
export class YearAddDialogComponent {
  yearForm!: FormGroup;
  showSubmit = false;
  isUpdateMode = false;
  startYear = moment().year(moment().year()).month(6).date(1);

  endYear = moment()
    .year(moment().year() + 1)
    .month(4)
    .date(1);

  academicYear = `${moment().year()} - ${moment().year() + 1}`;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<YearAddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isUpdateMode = data.isUpdateMode;
  }

  ngOnInit(): void {
    this.yearForm = this.fb.group({
      isActiveYear: [false, Validators.required],
    });
    if (this.isUpdateMode) {
      this.academicYear = `${moment(
        this.data.data.startYear
      ).year()} - ${moment(this.data.data.endYear).year()}`;
      this.yearForm.patchValue({ isActiveYear: this.data.data.isActiveYear });
    }
  }

  formDisable() {
    this.yearForm.disable();
    this.showSubmit = true;
  }

  formEnable() {
    this.yearForm.enable();
    this.showSubmit = false;
  }

  // startYearHandler(normalizedYear: Moment, dp: MatDatepicker<Moment>) {
  //   const { startYear } = this.yearForm.value;
  //   startYear.year(normalizedYear.year());
  //   this.yearForm.patchValue({ startYear });
  //   dp.close();
  // }

  // endYearHandler(normalizedYear: Moment, edp: MatDatepicker<Moment>) {
  //   const { endYear } = this.yearForm.value;
  //   endYear.year(normalizedYear.year());
  //   this.yearForm.patchValue({ endYear });
  //   edp.close();
  // }

  /// Year Submit
  yearSubmit() {
    this.yearForm.enable();
    this.showSubmit = false;
    const { isActiveYear } = this.yearForm.value;
    const year = {
      startYear: this.startYear,
      endYear: this.endYear,
      isActiveYear,
    };
    if (this.isUpdateMode) {
      this.dialogRef.close(isActiveYear);
    } else {
      this.dialogRef.close(year);
    }
  }
}
