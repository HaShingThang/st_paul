import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AcademicYear } from 'src/app/interfaces/interfaces';
import { AuthService } from '../auth/auth.service';
import { API_URL } from 'src/app/constants/api';
import { Router } from '@angular/router';
import { showDialog } from 'src/app/utils/functions';

@Injectable({
  providedIn: 'root',
})
export class AcademicYearService {
  private _academic_year: BehaviorSubject<AcademicYear[]>;
  yearStore: AcademicYear[] = [];
  public isLoading = false;

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private router: Router
  ) {
    this._academic_year = new BehaviorSubject<AcademicYear[]>([]);
    this.loadAllAcademicYear();
  }

  loadAllAcademicYear() {
    this.getAllAcademicYear().subscribe({
      next: (data: AcademicYear[]) => {
        this.yearStore = data;
        this._academic_year.next(this.yearStore);
      },
      error: (error) => {
        this._academic_year.error(error);
      },
    });
  }

  get academicYears() {
    return this._academic_year.asObservable();
  }

  getAllAcademicYear(academicyYear?: string): Observable<AcademicYear[]> {
    const params: any = {};
    if (academicyYear) {
      params.academicyYear = academicyYear;
    }
    return this.http.get<Array<AcademicYear>>(`${API_URL}/academic-year`, {
      params,
    });
  }

  /// Create
  createAcademicYear(academicYear: AcademicYear) {
    this.isLoading = true;
    return this.http
      .post<AcademicYear>(`${API_URL}/academic-year`, academicYear)
      .subscribe({
        next: (data) => {
          this.yearStore.push(data);
          this._academic_year.next(this.yearStore);
          this.router.navigate(['/academic-year']);
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          showDialog(error);
        },
      });
  }

  //Update
  updateAcademicYear(id: number, isActiveYear: boolean) {
    this.isLoading = true;
    return this.http
      .put<AcademicYear>(`${API_URL}/academic-year/${id}`, { isActiveYear })
      .subscribe({
        next: (data) => {
          this.yearStore = this.yearStore.map((ele) =>
            ele.id === id ? data : ele
          );
          this._academic_year.next(this.yearStore);
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
          showDialog(error);
        },
      });
  }

  //GetbyId
  getAcademicYearById(id: number): Observable<AcademicYear> {
    return this.http.get<AcademicYear>(`${API_URL}/academic-year/${id}`);
  }
}
