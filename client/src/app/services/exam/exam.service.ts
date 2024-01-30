import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ExamData } from 'src/app/interfaces/interfaces';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_URL } from 'src/app/constants/api';
import { showDialog } from 'src/app/utils/functions';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root',
})
export class ExamService {
  private _exams: BehaviorSubject<ExamData[]>;
  examStore: ExamData[] = [];
  public isLoading = false;

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private router: Router
  ) {
    this._exams = new BehaviorSubject<ExamData[]>([]);
    this.loadAllExams();
  }

  loadAllExams() {
    this.getAllExams().subscribe({
      next: (data: ExamData[]) => {
        this.examStore = data;
        this._exams.next(this.examStore);
      },
      error: (error) => {
        this._exams.error(error);
      },
    });
  }

  /// Get exams
  get exams() {
    return this._exams.asObservable();
  }

  /// Get All
  getAllExams(
    grade?: string,
    period?: string,
    examDate?: string,
    examTime?: string
  ) {
    const params: any = {};
    if (grade) {
      if (grade === 'kg') {
        params.grade = grade.toUpperCase();
      } else {
        params.grade = grade.charAt(0).toUpperCase() + grade.slice(1);
      }
    }
    if (period) {
      params.period = period;
    }
    if (examDate) {
      const searchExamDate = moment(examDate).format('YYYY-MM-DD');
      params.examDate = searchExamDate;
    }
    if (examTime) {
      const searchExamTime = moment(examTime, 'HH:mm A').format('HH:mm:ss.SSS');
      params.examTime = searchExamTime;
    }
    return this.http.get<Array<ExamData>>(`${API_URL}/exams`, { params });
  }

  /// Create
  createExam(exam: ExamData, param?: string) {
    this.isLoading = true;
    return this.http.post<ExamData>(`${API_URL}/exams`, exam).subscribe({
      next: (data) => {
        this.examStore.push(data);
        this._exams.next(this.examStore);
        this.router.navigate(['/exams']);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.log(error);
        showDialog(error);
      },
    });
  }
  /// Create
  updateExam(exam: ExamData, examId?: number) {
    this.isLoading = true;
    return this.http
      .put<ExamData>(`${API_URL}/exams/${examId}`, exam)
      .subscribe({
        next: (data) => {
          this.examStore = this.examStore.map((ele) =>
            ele.id === examId ? data : ele
          );
          this._exams.next(this.examStore);
          this.isLoading = false;
          this.router.navigate(['/exams']);
        },
        error: (error) => {
          this.isLoading = false;
          showDialog(error);
        },
      });
  }

  /// Delete
  deleteExam(exam: ExamData): Observable<ExamData> {
    return this.http.delete<ExamData>(`${API_URL}/exams/${exam.id}`);
  }

  /// GetbyId
  getExamById(id: number): Observable<ExamData> {
    return this.http.get<ExamData>(`${API_URL}/exams/${id}`);
  }
}
