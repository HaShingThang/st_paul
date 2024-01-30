import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  deleteMessage,
  isAdmin,
  noResultFound,
  searching,
} from 'src/app/constants/messages';
import { TeacherData } from 'src/app/interfaces/interfaces';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TeacherService } from 'src/app/services/teacher/teacher.service';
import {
  errorMessageDialog,
  confirmationDialog,
} from 'src/app/utils/alert-dialog';
import { exportToExcel } from 'src/app/utils/export-excel';
import { showDialog } from 'src/app/utils/functions';

@Component({
  selector: 'app-teacher-list',
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.scss'],
})
export class TeacherListComponent implements OnInit {
  displayedColumns: string[] = [
    'No',
    'Name',
    'Email',
    'Teaching',
    'Address',
    'PhNo',
  ];

  teacherData = new MatTableDataSource<TeacherData>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  searchValue = '';
  isLoading = false;
  noData = '';
  searching = '';

  constructor(
    private teacherService: TeacherService,
    private router: Router,
    public authService: AuthService
  ) {
    if (this.authService.isAdmin()) {
      this.displayedColumns.push('Action');
    }
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.teacherService.teachers.subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          let teacherData = data;
          teacherData = teacherData.map((data: TeacherData, index: number) => ({
            ...data,
            no: index + 1,
          }));
          this.teacherData.data = teacherData;
          if (this.teacherData.data.length) {
            this.noData = '';
            this.isLoading = false;
          }
        } else {
          this.isLoading = false;
          showDialog(data);
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        showDialog(error);
        this.router.navigate(['/dashboard']);
      },
    });
  }

  //Get Grades
  getGrades(grades: any): string {
    return grades.map((grade: any) => grade.grade).join(', ');
  }

  ngAfterViewInit(): void {
    this.teacherData.paginator = this.paginator;
    this.teacherData.sort = this.sort;
  }

  /// Delete
  async deleteTeacher(teacher: TeacherData) {
    if (!this.authService.isAdmin()) {
      errorMessageDialog(`${isAdmin} "${teacher.username}"`);
    } else {
      const title = `${deleteMessage} "${teacher.username}"?`;
      const result = await confirmationDialog(title);
      if (result.isConfirmed) {
        this.teacherService.deleteTeacher(teacher);
      }
    }
  }

  /// Search
  searchTeacher() {
    if (!this.searchValue) {
      return this.ngOnInit();
    }
    this.searching = searching;
    this.isLoading = true;
    this.teacherService.getAllTeachers(this.searchValue).subscribe({
      next: (data) => {
        let teacherData = data;
        teacherData = teacherData.map((data: TeacherData, index: number) => ({
          ...data,
          no: index + 1,
        }));
        this.teacherData.data = teacherData;
        if (this.teacherData.data.length) {
          this.isLoading = false;
          this.noData = '';
          this.searching = '';
          this.teacherData.sort = this.sort;
          this.teacherData.paginator = this.paginator;
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

  /// Export Excel
  exportExcel() {
    const teacherData = this.teacherData.data.map(
      (data: any, index: number) => {
        const grade = this.getGrades(data.grades);
        return [
          index + 1,
          data.username,
          data.email,
          grade,
          data.address ? data.address : '-',
          data.phNo ? data.phNo : '-',
        ];
      }
    );
    const columns = [...this.displayedColumns];
    columns.splice(6);
    teacherData.length &&
      exportToExcel(teacherData, columns, 'teacherData', 'teacher');
  }
}
