import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import {
  createData,
  deleteMessage,
  isAdmin,
  noResultFound,
  searching,
} from 'src/app/constants/messages';
import {
  Grade,
  GuardianInfo,
  StudentData,
} from 'src/app/interfaces/interfaces';
import { AuthService } from 'src/app/services/auth/auth.service';
import { StudentService } from 'src/app/services/student/student.service';
import { exportToExcel } from 'src/app/utils/export-excel';
import { showDialog } from 'src/app/utils/functions';
import { GuardianDialogComponent } from '../guardian-dialog/guardian-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import {
  confirmationDialog,
  errorMessageDialog,
} from 'src/app/utils/alert-dialog';
import { GradeService } from 'src/app/services/grade/grade.service';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss'],
})
export class StudentListComponent implements OnInit {
  displayedColumns: string[] = [
    'No',
    'Name',
    'StudentID',
    'Grade',
    'Gender',
    'Academic Year',
    'GuardianInfo',
    'Address',
  ];
  getParam!: string;
  studentData = new MatTableDataSource<StudentData>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  searchValue = '';
  isLoading = false;
  noData = '';
  searching = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    private studentService: StudentService,
    private dialog: MatDialog,
    private gradeService: GradeService
  ) {
    if (this.authService.isAuth()) {
      this.displayedColumns.push('Action');
    }
  }

  ngOnInit(): void {
    this.isLoading = true;
    const { grade } = this.route.snapshot.params;
    this.getParam = grade;
    this.gradeService.grades.subscribe({
      next: (data: Grade[]) => {
        this.isLoading = true;
        if (data.length) {
          const filteredGrades = data.filter(
            (grade: Grade) => grade.grade.toLowerCase() === this.getParam
          );
          if (!filteredGrades.length) {
            this.isLoading = false;
            errorMessageDialog(`Grade not found!`);
            this.router.navigate([`student-dashboard`]);
          }
        }
      },
      error: (error) => {
        this.isLoading = false;
        showDialog(error);
        this.router.navigate([`student-dashboard`]);
      },
    });
    this.studentService.getAllStudents(this.getParam).subscribe({
      next: (data) => {
        if (!data.length) {
          this.noData = createData;
          this.isLoading = false;
        }
        let studentData = data.map((data: StudentData, index: number) => ({
          ...data,
          no: index + 1,
        }));
        this.studentData.data = studentData;
        if (this.studentData.data.length) {
          this.noData = '';
          this.isLoading = false;
        }
      },
      error: (error) => {
        this.isLoading = false;
        showDialog(error);
        this.router.navigate(['/student-dashboard']);
      },
    });
  }

  ngAfterViewInit(): void {
    this.studentData.paginator = this.paginator;
    this.studentData.sort = this.sort;
  }

  /// Delete
  async deleteStudent(student: StudentData) {
    if (!this.authService.isAdmin()) {
      errorMessageDialog(`${isAdmin} "${student.name}"`);
    } else {
      const title = `${deleteMessage} "${student.name}"?`;
      const result = await confirmationDialog(title);
      if (result.isConfirmed) {
        this.studentService.deleteStudent(student).subscribe({
          next: () => {
            const index = this.studentData.data.findIndex(
              (s) => s.id === student.id
            );
            if (index !== -1) {
              this.studentData.data.splice(index, 1);
              for (let i = index; i < this.studentData.data.length; i++) {
                this.studentData.data[i].no = i + 1;
              }
              this.studentData._updateChangeSubscription();
            }
            if (!this.studentData.data.length) {
              this.noData = createData;
            }
          },
          error: (error) => {
            showDialog(error);
          },
        });
      }
    }
  }

  /// Search
  searchStudent() {
    if (!this.searchValue) {
      return this.ngOnInit();
    }
    this.searching = searching;
    this.isLoading = true;
    this.studentService
      .getAllStudents(this.getParam, this.searchValue)
      .subscribe({
        next: (data) => {
          let studentData = data;
          studentData = studentData.map((data: StudentData, index: number) => ({
            ...data,
            no: index + 1,
          }));
          this.studentData.data = studentData;
          if (this.studentData.data.length) {
            this.isLoading = false;
            this.noData = '';
            this.searching = '';
            this.studentData.sort = this.sort;
            this.studentData.paginator = this.paginator;
          } else {
            this.searching = '';
            this.noData = noResultFound;
            this.isLoading = false;
          }
        },
        error: (error) => {
          this.isLoading = false;
          showDialog(error);
          this.router.navigate(['/dashboard']);
        },
      });
  }

  /// Clear Search
  clearSearch() {
    this.searchValue = '';
    this.noData = '';
    return this.ngOnInit();
  }

  /// Create Guardian Dialog
  openDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string,
    guardianInfo: GuardianInfo,
    studentName: string
  ): void {
    this.dialog.open(GuardianDialogComponent, {
      width: '380px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: { guardianInfo, studentName },
    });
  }

  /// Export Excel
  exportExcel() {
    const studentData = this.studentData.data.map(
      (data: any, index: number) => {
        const academicYear = `${moment(
          data.academicYear.startYear
        ).year()} - ${moment(data.academicYear.endYear).year()}`;
        return [
          index + 1,
          data.name,
          data.studentId,
          data.grade.grade,
          academicYear,
          data.guardianInfo.guardianName,
          data.guardianInfo.phNo,
          data.address,
        ];
      }
    );
    const columns = [...this.displayedColumns];
    columns.splice(
      columns.indexOf('GuardianInfo'),
      1,
      'Guardian Name',
      'Ph No'
    );
    columns.splice(9);

    studentData.length &&
      exportToExcel(studentData, columns, 'StudentData', 'students');
  }
}
