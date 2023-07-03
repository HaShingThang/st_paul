import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { Observable, Subject } from 'rxjs';
import { API_URL } from 'src/app/constants/api';
import { ROLES } from 'src/app/constants/constants';
import { sessionExpired } from 'src/app/constants/messages';
import { Login } from 'src/app/interfaces/interfaces';
import { confirmationDialog, expiredDialog } from 'src/app/utils/alert-dialog';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: string = '';
  public authenticated = false;
  private logoutSubject: Subject<void> = new Subject<void>();

  constructor(private http: HttpClient, private router: Router) {
    this.loadToken();
  }

  private loadToken() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const tokenExpiration = jwt_decode<{ exp: number }>(token).exp;
        const currentTimestamp = Math.floor(Date.now() / 1000);
        if (tokenExpiration < currentTimestamp) {
          this.sessionExpired(sessionExpired);
        } else {
          this.setAuth(token);
        }
      } catch (error) {
        this.sessionExpired(sessionExpired);
      }
    }
  }

  public isAuth(): boolean {
    return this.authenticated;
  }

  public setAuth(token: string) {
    this.token = token;
    this.authenticated = true;
  }

  public login(
    email: string,
    password: string,
    role: string
  ): Observable<Login> {
    return this.http.post<Login>(`${API_URL}/auth/local`, {
      email,
      password,
      role,
    });
  }

  public getToken(): string {
    return this.token;
  }

  public getRole(): string | null {
    if (this.token) {
      const userInfo: any = jwt_decode(this.token);
      return userInfo.role.name;
    }
    return null;
  }

  public isTeacher(): boolean {
    const role = this.getRole();
    return role === ROLES.TEACHER;
  }

  //Is Admin
  public isAdmin(): boolean {
    const role = this.getRole();
    return role == ROLES.ADMIN || role == ROLES.SUPER_ADMIN;
  }

  //Is SuperAdmin
  public isSuperAdmin(): boolean {
    const role = this.getRole();
    return role == ROLES.SUPER_ADMIN;
  }

  // Check Other Admin
  public isAnotherAdmin(
    role: string,
    id: string | number | undefined
  ): boolean {
    const adminId = this.getID();
    if (role === 'Admin' && typeof id === 'number' && id !== adminId) {
      return true;
    }
    return false;
  }

  public getID(): number {
    if (this.token) {
      const userInfo: any = jwt_decode(this.token);
      return userInfo.id;
    }
    return 0;
  }

  public getCurrentUser(): Observable<any> {
    return this.http.get(`${API_URL}/users/me`);
  }

  public async logout() {
    const result = await confirmationDialog(
      'Are you sure you want to log out?'
    );
    if (result.isConfirmed) {
      localStorage.removeItem('token');
      this.token = '';
      this.authenticated = false;
      this.logoutSubject.next();
      this.router.navigate(['/']);
    }
  }

  public logOut() {
    localStorage.removeItem('token');
    this.token = '';
    this.authenticated = false;
    this.logoutSubject.next();
    this.router.navigate(['/']);
  }

  public async sessionExpired(message: string) {
    const result = await expiredDialog(message);
    if (result.isConfirmed) {
      localStorage.removeItem('token');
      this.token = '';
      this.authenticated = false;
      this.logoutSubject.next();
      this.router.navigate(['/']);
    } else {
      localStorage.removeItem('token');
      this.token = '';
      this.authenticated = false;
      this.logoutSubject.next();
      this.router.navigate(['/']);
    }
  }

  public onLogout(): Observable<void> {
    return this.logoutSubject.asObservable();
  }
}
