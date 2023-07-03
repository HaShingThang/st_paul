import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_URL } from 'src/app/constants/api';
import { AdminData } from 'src/app/interfaces/interfaces';
import { showDialog } from 'src/app/utils/functions';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { superAdmin } from '../../constants/messages';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private _admins: BehaviorSubject<AdminData[]>;
  adminStore: AdminData[] = [];
  public isLoading = false;

  constructor(
    private http: HttpClient,
    public authService: AuthService,
    private router: Router
  ) {
    this._admins = new BehaviorSubject<AdminData[]>([]);
    this.loadAllAdmin();
  }

  loadAllAdmin() {
    this.getAllAdmins().subscribe({
      next: (data: AdminData[]) => {
        this.adminStore = data;
        this._admins.next(this.adminStore);
      },
      error: (error) => {
        this._admins.error(error);
      },
    });
  }

  get admins() {
    return this._admins.asObservable();
  }

  getAllAdmins(username?: string) {
    const params: any = {};
    if (username) {
      params.username = username;
    }
    return this.http.get<Array<AdminData>>(`${API_URL}/users`, { params });
  }

  //Delete Admin
  deleteAdmin(admin: AdminData) {
    return this.http
      .delete<AdminData>(`${API_URL}/users/${admin.id}`)
      .subscribe({
        next: (_) => {
          this.adminStore = this.adminStore.filter((ele) => ele.id != admin.id);
          this._admins.next(this.adminStore);
        },
        error: (error) => {
          showDialog(error);
        },
      });
  }

  //Create
  createAdmin(admin: AdminData) {
    this.isLoading = true;
    return this.http.post<AdminData>(`${API_URL}/users`, admin).subscribe({
      next: (data) => {
        this.adminStore.push(data);
        this._admins.next(this.adminStore);
        this.router.navigate(['/admin-list']);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        showDialog(error);
      },
    });
  }

  //Update
  updateAdmin(id: number, admin: AdminData) {
    this.isLoading = true;
    return this.http.put<AdminData>(`${API_URL}/users/${id}`, admin).subscribe({
      next: (data) => {
        this.adminStore = this.adminStore.map((ele) =>
          ele.id === id ? data : ele
        );
        this._admins.next(this.adminStore);
        this.isLoading = false;
        this.router.navigate(['/admin-list']);
      },
      error: (error) => {
        this.isLoading = false;
        showDialog(error);
      },
    });
  }

  //GetbyId
  getAdminById(id: number): Observable<AdminData> {
    return this.http.get<AdminData>(`${API_URL}/users/${id}`);
  }
}
