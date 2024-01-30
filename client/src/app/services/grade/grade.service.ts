import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_URL } from 'src/app/constants/api';
import { Grade } from 'src/app/interfaces/interfaces';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class GradeService {
  private _grades: BehaviorSubject<Grade[]>;
  gradeStore: Grade[] = [];

  constructor(
    private http: HttpClient,
    public authService: AuthService,
  ) {
    this._grades = new BehaviorSubject<Grade[]>([]);
    this.loadAllGrades();
  }

  loadAllGrades() {
    this.getAllGrades().subscribe({
      next: (data: Grade[]) => {
        this.gradeStore = data;
        this._grades.next(this.gradeStore);
      },
      error: (error) => {
        this._grades.error(error);
      },
    });
  }

  get grades() {
    return this._grades.asObservable();
  }

  getAllGrades(grades?: string): Observable<Grade[]> {
    const params: any = {};
    if (grades) {
      params.grades = grades;
    }
    return this.http.get<Array<Grade>>(`${API_URL}/grades`, { params });
  }

  /// Create Grade
  createGrade(grade: Grade) {
    return this.http.post<Grade>(`${API_URL}/grades`, grade);
  }
}
