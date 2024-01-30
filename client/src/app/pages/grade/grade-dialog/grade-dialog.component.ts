import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Grade } from 'src/app/interfaces/interfaces';
import { GradeService } from '../../../services/grade/grade.service';
import { showDialog } from 'src/app/utils/functions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grade-dialog',
  templateUrl: './grade-dialog.component.html',
  styleUrls: ['./grade-dialog.component.scss'],
})
export class GradeDialogComponent implements OnInit {
  gradeForm!: FormGroup;
  grades: Grade[] = [
    { grade: 'KG' },
    { grade: 'Grade-1' },
    { grade: 'Grade-2' },
    { grade: 'Grade-3' },
    { grade: 'Grade-4' },
    { grade: 'Grade-5' },
    { grade: 'Grade-6' },
    { grade: 'Grade-7' },
    { grade: 'Grade-8' },
    { grade: 'Grade-9' },
    { grade: 'Grade-10' },
    { grade: 'Grade-11' },
    { grade: 'Grade-12' },
  ];

  showSubmit = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<GradeDialogComponent>,
    public gradeService: GradeService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    console.log(this.data)
    this.gradeForm = this.fb.group({
      grade: ['', Validators.required],
    });
  }

  formDisable() {
    this.gradeForm.disable();
    this.showSubmit = true;
  }

  formEnable() {
    this.gradeForm.enable();
    this.showSubmit = false;
  }

  /// Grade Submit
  gradeSubmit() {
    this.gradeForm.enable();
    this.showSubmit = false;
    const grade = this.gradeForm.value;
    this.dialogRef.close(grade);
  }
}
