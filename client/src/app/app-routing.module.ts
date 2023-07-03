import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { StudentLoginComponent } from './pages/auth/student-login/student-login.component';
import { AdminLoginComponent } from './pages/auth/admin-login/admin-login.component';
import { TeacherLoginComponent } from './pages/auth/teacher-login/teacher-login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { authGuard } from './guards/auth.guard';
import { ROLES } from './constants/constants';
import { AdminListComponent } from './pages/admin/admin-list/admin-list.component';
import { AdminAddEditComponent } from './pages/admin/admin-add-edit/admin-add-edit.component';
import { TeacherListComponent } from './pages/teacher/teacher-list/teacher-list.component';
import { TeacherAddEditComponent } from './pages/teacher/teacher-add-edit/teacher-add-edit.component';
import { StudentListComponent } from './pages/student/student-list/student-list.component';
import { StudentAddEditComponent } from './pages/student/student-add-edit/student-add-edit.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'student-login', component: StudentLoginComponent },
  { path: 'admin-login', component: AdminLoginComponent },
  { path: 'teacher-login', component: TeacherLoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    data: {
      role: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT],
    },
  },
  {
    path: 'admin-list',
    component: AdminListComponent,
    canActivate: [authGuard],
    data: {
      role: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    },
  },
  {
    path: 'admin-add',
    component: AdminAddEditComponent,
    canActivate: [authGuard],
    data: {
      role: [ROLES.SUPER_ADMIN],
    },
  },
  {
    path: 'admin-edit/:id',
    component: AdminAddEditComponent,
    canActivate: [authGuard],
    data: {
      role: [ROLES.SUPER_ADMIN],
    },
  },
  {
    path: 'teacher-list',
    component: TeacherListComponent,
    canActivate: [authGuard],
    data: {
      role: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER],
    },
  },
  {
    path: 'teacher-add',
    component: TeacherAddEditComponent,
    canActivate: [authGuard],
    data: {
      role: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    },
  },
  {
    path: 'teacher-edit/:id',
    component: TeacherAddEditComponent,
    canActivate: [authGuard],
    data: {
      role: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    },
  },
  {
    path: 'student-list',
    component: StudentListComponent,
    canActivate: [authGuard],
    data: {
      role: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER],
    },
  },
  {
    path: 'student-add',
    component: StudentAddEditComponent,
    canActivate: [authGuard],
    data: {
      role: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER],
    },
  },
  {
    path: 'student-edit',
    component: StudentAddEditComponent,
    canActivate: [authGuard],
    data: {
      role: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER],
    },
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
