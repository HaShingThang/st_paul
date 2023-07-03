import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { SplashScreenComponent } from './screens/splash-screen/splash-screen.component';
import { LoadingScreenComponent } from './screens/loading-screen/loading-screen.component';
import { HomeCardComponent } from './components/home-card/home-card.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FooterComponent } from './components/footer/footer.component';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TokenInterceptor } from './interceptor/token.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './modules/material.module';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { StudentLoginComponent } from './pages/auth/student-login/student-login.component';
import { AdminLoginComponent } from './pages/auth/admin-login/admin-login.component';
import { TeacherLoginComponent } from './pages/auth/teacher-login/teacher-login.component';
import { DashboardCardComponent } from './components/dashboard-card/dashboard-card.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AdminListComponent } from './pages/admin/admin-list/admin-list.component';
import { AdminAddEditComponent } from './pages/admin/admin-add-edit/admin-add-edit.component';
import { DashboardNavComponent } from './components/dashboard-nav/dashboard-nav.component';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { AuthService } from './services/auth/auth.service';
import { accountDeleted, serverError } from './constants/messages';
import { BackComponent } from './components/back/back.component';
import { TeacherListComponent } from './pages/teacher/teacher-list/teacher-list.component';
import { TeacherAddEditComponent } from './pages/teacher/teacher-add-edit/teacher-add-edit.component';
import { StudentListComponent } from './pages/student/student-list/student-list.component';
import { StudentAddEditComponent } from './pages/student/student-add-edit/student-add-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    SplashScreenComponent,
    LoadingScreenComponent,
    HomeCardComponent,
    NavBarComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    StudentLoginComponent,
    AdminLoginComponent,
    TeacherLoginComponent,
    DashboardCardComponent,
    DashboardComponent,
    AdminListComponent,
    AdminAddEditComponent,
    DashboardNavComponent,
    SearchInputComponent,
    BackComponent,
    TeacherListComponent,
    TeacherAddEditComponent,
    StudentListComponent,
    StudentAddEditComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
  ],
  providers: [
    SplashScreenComponent,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private authService: AuthService) {
    if (this.authService.isAuth()) {
      this.authService.getCurrentUser().subscribe({
        error: (error) => {
          if (error) {
            this.authService.sessionExpired(accountDeleted);
          } else {
            this.authService.sessionExpired(serverError);
          }
        },
      });
    }
  }
}
