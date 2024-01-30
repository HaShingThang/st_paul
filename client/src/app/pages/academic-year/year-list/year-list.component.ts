import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth/auth.service';
import { showDialog } from 'src/app/utils/functions';
import { YearAddDialogComponent } from '../year-add-dialog/year-add-dialog.component';
import { AcademicYearService } from 'src/app/services/academic-year/academic-year.service';
import { MatTableDataSource } from '@angular/material/table';
import { AcademicYear } from 'src/app/interfaces/interfaces';
import { MatPaginator } from '@angular/material/paginator';
import { createData } from 'src/app/constants/messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-year-list',
  templateUrl: './year-list.component.html',
  styleUrls: ['./year-list.component.scss'],
})
export class YearListComponent implements OnInit {
  displayedColumns: string[] = [
    'No',
    'Academic Year',
    'Student Count',
    'Active Year',
  ];
  academicYear = new MatTableDataSource<AcademicYear>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  isLoading = false;
  noData!: string;

  constructor(
    public authService: AuthService,
    private dialog: MatDialog,
    public academicYearService: AcademicYearService,
    private router: Router
  ) {
    if (this.authService.isAdmin()) {
      this.displayedColumns.push('Action');
    }
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.academicYearService.getAllAcademicYear().subscribe({
      next: (data) => {
        this.isLoading = false;
        if (!data.length) {
          this.noData = createData;
        }

        let academicYear = data.map((data: AcademicYear, index: number) => ({
          ...data,
          no: index + 1,
        }));
        this.academicYear.data = academicYear;
        this.academicYear.paginator = this.paginator;
      },
      error: (error) => {
        this.isLoading = false;
        showDialog(error);
        this.router.navigate(['/dashboard']);
      },
    });
  }

  /// Create Year Dialog
  openAddYearDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string
  ): void {
    const dialogRef: MatDialogRef<YearAddDialogComponent> = this.dialog.open(
      YearAddDialogComponent,
      {
        width: '380px',
        enterAnimationDuration,
        exitAnimationDuration,
        data: { isUpdateMode: false },
      }
    );

    dialogRef.afterClosed().subscribe((year) => {
      if (!year) return;
      this.isLoading = true;
      this.academicYearService.createAcademicYear(year);
      this.academicYearService.academicYears.subscribe({
        next: (data) => {
          this.isLoading = false;

          let academicYear = data.map((data: AcademicYear, index: number) => ({
            ...data,
            no: index + 1,
          }));
          this.academicYear.data = academicYear;
          this.academicYear.paginator = this.paginator;
        },
        error: (error) => {
          this.isLoading = false;
          showDialog(error);
          this.router.navigate(['/dashboard']);
        },
      });
      this.isLoading = false;
    });
  }

  /// Edit Active Year
  openEditYearDialog(
    enterAnimationDuration: string,
    exitAnimationDuration: string,
    academicYear: AcademicYear
  ) {
    this.isLoading = true;
    this.academicYearService.getAcademicYearById(academicYear.id!).subscribe({
      next: (data) => {
        this.isLoading = false;
        const dialogRef: MatDialogRef<YearAddDialogComponent> =
          this.dialog.open(YearAddDialogComponent, {
            width: '380px',
            enterAnimationDuration,
            exitAnimationDuration,
            data: { data, isUpdateMode: true },
          });

        dialogRef.afterClosed().subscribe((isActiveYear) => {
          if (isActiveYear == academicYear.isActiveYear) {
            return;
          }
          this.isLoading = true;
          this.academicYearService.updateAcademicYear(
            academicYear.id!,
            isActiveYear
          );
          this.academicYearService.academicYears.subscribe({
            next: (data) => {
              this.isLoading = false;
              if (!data.length) {
                this.noData = createData;
              }

              let academicYear = data.map(
                (data: AcademicYear, index: number) => ({
                  ...data,
                  no: index + 1,
                })
              );
              this.academicYear.data = academicYear;
              this.academicYear.paginator = this.paginator;
            },
            error: (error) => {
              this.isLoading = false;
              showDialog(error);
              this.router.navigate(['/dashboard']);
            },
          });
          this.isLoading = false;
        });
      },
      error: (error) => {
        this.isLoading = false;
        showDialog(error);
      },
    });
  }
}
