import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_URL } from 'src/app/constants/api';
import { TeacherData } from 'src/app/interfaces/interfaces';
import { AuthService } from '../auth/auth.service';
import { showDialog } from 'src/app/utils/functions';

@Injectable({
  providedIn: 'root',
})
export class TeacherService {
  private _teacers: BehaviorSubject<TeacherData[]>;
  teacherStore: TeacherData[] = [];
  public isLoading = false;

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private router: Router
  ) {
    this._teacers = new BehaviorSubject<TeacherData[]>([]);
    this.loadAllteacher();
  }

  loadAllteacher() {
    this.getAllTeachers().subscribe({
      next: (data: TeacherData[]) => {
        this.teacherStore = data;
        this._teacers.next(this.teacherStore);
      },
      error: (error) => {
        this._teacers.error(error);
      },
    });
  }

  /// Get Teachers
  get teachers() {
    return this._teacers.asObservable();
  }

  /// Get Teachers
  getAllTeachers(username?: string) {
    const params: any = {};
    if (username) {
      params.username = username;
    }
    return this.http.get<Array<TeacherData>>(
      `${API_URL}/users-permissions/teachers`,
      { params }
    );
  }

  //Delete Teacher
  deleteTeacher(teacher: TeacherData) {
    return this.http
      .delete<TeacherData>(
        `${API_URL}/users-permissions/teachers/${teacher.id}`
      )
      .subscribe({
        next: (_) => {
          this.teacherStore = this.teacherStore.filter(
            (ele) => ele.id != teacher.id
          );
          this._teacers.next(this.teacherStore);
        },
        error: (error) => {
          showDialog(error);
        },
      });
  }

  //Create
  createTeacher(teacher: TeacherData) {
    this.isLoading = true;
    return this.http
      .post<TeacherData>(`${API_URL}/users-permissions/teachers`, teacher)
      .subscribe({
        next: (data) => {
          this.teacherStore.push(data);
          this._teacers.next(this.teacherStore);
          this.router.navigate(['/teacher-list']);
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          showDialog(error);
        },
      });
  }

  //Update
  updateTeacher(id: number, teacher: TeacherData) {
    this.isLoading = true;
    return this.http
      .put<TeacherData>(`${API_URL}/users-permissions/teachers/${id}`, teacher)
      .subscribe({
        next: (data) => {
          this.teacherStore = this.teacherStore.map((ele) =>
            ele.id === id ? data : ele
          );
          this._teacers.next(this.teacherStore);
          this.isLoading = false;
          this.router.navigate(['/teacher-list']);
        },
        error: (error) => {
          this.isLoading = false;
          showDialog(error);
        },
      });
  }

  //GetbyId
  getTeacherById(id: number): Observable<TeacherData> {
    return this.http.get<TeacherData>(
      `${API_URL}/users-permissions/teachers/${id}`
    );
  }
}
