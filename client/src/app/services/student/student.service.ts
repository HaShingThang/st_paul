import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, mergeMap } from 'rxjs';
import { GuardianInfo, StudentData } from 'src/app/interfaces/interfaces';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { API_URL } from 'src/app/constants/api';
import { showDialog } from 'src/app/utils/functions';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  // private _students: BehaviorSubject<StudentData[]>;
  studentStore: StudentData[] = [];
  public isLoading = false;

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private router: Router
  ) {
    // this._students = new BehaviorSubject<StudentData[]>([]);
    // this.loadAllStudents();
  }

  // loadAllStudents() {
  //   this.getAllStudents().subscribe({
  //     next: (data: StudentData[]) => {
  //       this.studentStore = data;
  //       this._students.next(this.studentStore);
  //     },
  //     error: (error) => {
  //       this._students.error(error);
  //     },
  //   });
  // }

  /// Get Students
  // get students() {
  //   return this._students.asObservable();
  // }

  /// Get All
  getAllStudents(grade?: string, name?: string) {
    const params: any = {};
    if (grade) {
      if (grade === 'kg') {
        params.grade = grade.toUpperCase();
      } else {
        params.grade = grade.charAt(0).toUpperCase() + grade.slice(1);
      }
    }
    if (name) {
      params.name = name;
    }
    return this.http.get<Array<StudentData>>(`${API_URL}/students`, { params });
  }

  /// Create
  createStudent(student: StudentData, param?: string) {
    const guardianInfo = {
      guardianName: student.guardianName,
      phNo: student.phNo,
    };
    this.isLoading = true;
    return this.http
      .post<GuardianInfo>(`${API_URL}/guardian-infos`, guardianInfo)
      .pipe(
        mergeMap((response) => {
          const studentInfo = {
            name: student.name,
            studentId: student.studentId,
            grade: student.grade,
            gender: student.gender,
            academicYear: student.academicYear,
            address: student.address,
            guardianInfo: response,
          };

          return this.http.post<GuardianInfo>(
            `${API_URL}/students`,
            studentInfo
          );
        })
      )
      .subscribe({
        next: (_) => {
          this.router.navigate([`/students/${param}`]);
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          showDialog(error);
        },
      });
  }
  /// Create
  updateStudent(
    student: StudentData,
    param?: string,
    studentId?: number,
    guardianId?: number
  ) {
    this.isLoading = true;
    if (guardianId) {
      const guardianInfo = {
        guardianName: student.guardianName,
        phNo: student.phNo,
      };
      return this.http
        .put<GuardianInfo>(
          `${API_URL}/guardian-infos/${guardianId}`,
          guardianInfo
        )
        .pipe(
          mergeMap((response) => {
            const studentInfo = {
              name: student.name,
              studentId: student.studentId,
              grade: student.grade,
              academicYear: student.academicYear,
              address: student.address,
              guardianInfo: response,
            };

            return this.http.put<GuardianInfo>(
              `${API_URL}/students/${studentId}`,
              studentInfo
            );
          })
        )
        .subscribe({
          next: (_) => {
            this.router.navigate([`/students/${param}`]);
            this.isLoading = false;
          },
          error: (error) => {
            this.isLoading = false;
            showDialog(error);
          },
        });
    } else {
      return this.http
        .put<StudentData>(`${API_URL}/students/${studentId}`, student)
        .subscribe({
          next: (_) => {
            this.router.navigate([`/students/${param}`]);
            this.isLoading = false;
          },
          error: (error) => {
            this.isLoading = false;
            showDialog(error);
          },
        });
    }
  }

  /// Delete
  deleteStudent(student: StudentData): Observable<StudentData> {
    return this.http
      .delete<GuardianInfo>(
        `${API_URL}/guardian-infos/${student.guardianInfo?.id}`
      )
      .pipe(
        mergeMap((_) => {
          return this.http.delete<StudentData>(
            `${API_URL}/students/${student.id}`
          );
        })
      );
  }

  /// GetbyId
  getStudentById(id: number): Observable<StudentData> {
    return this.http.get<StudentData>(`${API_URL}/students/${id}`);
  }
}
