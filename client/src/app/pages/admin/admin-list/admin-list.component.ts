import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ROLES } from 'src/app/constants/constants';
import {
  deleteMessage,
  noResultFound,
  searching,
  superAdmin,
} from 'src/app/constants/messages';
import { AdminData } from 'src/app/interfaces/interfaces';
import { AdminService } from 'src/app/services/admin/admin.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import {
  confirmationDialog,
  errorMessageDialog,
} from 'src/app/utils/alert-dialog';
import { exportToExcel } from 'src/app/utils/export-excel';
import { showDialog } from 'src/app/utils/functions';

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.scss'],
})
export class AdminListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['No', 'Name', 'Email', 'PhNo', 'Role'];

  adminData = new MatTableDataSource<AdminData>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  searchValue = '';
  isLoading = false;
  noData = '';
  searching = '';

  constructor(
    private adminService: AdminService,
    public router: Router,
    public authService: AuthService
  ) {
    if (this.authService.isSuperAdmin()) {
      this.displayedColumns.push('Action');
    }
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.adminService.admins.subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          let adminData = data;
          adminData = adminData.map((data: AdminData, index: number) => ({
            ...data,
            no: index + 1,
          }));
          this.adminData.data = adminData;
          if (this.adminData.data.length) {
            this.noData = '';
            this.isLoading = false;
          }
        } else {
          this.isLoading = false;
          showDialog(data);
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        showDialog(error);
        this.router.navigate(['/dashboard']);
      },
    });
  }

  ngAfterViewInit(): void {
    this.adminData.paginator = this.paginator;
    this.adminData.sort = this.sort;
  }

  //Delete
  async deleteAdmin(admin: AdminData) {
    if (admin.role.name === ROLES.SUPER_ADMIN) {
      errorMessageDialog(superAdmin);
    } else {
      const title = `${deleteMessage} "${admin.username}"?`;
      const result = await confirmationDialog(title);
      if (result.isConfirmed) {
        this.adminService.deleteAdmin(admin);
      }
    }
  }

  //Search
  searchAdmin() {
    if (!this.searchValue) {
      return this.ngOnInit();
    }
    this.searching = searching;
    this.isLoading = true;
    this.adminService.getAllAdmins(this.searchValue).subscribe({
      next: (data) => {
        let adminData = data;
        adminData = adminData.map((data: AdminData, index: number) => ({
          ...data,
          no: index + 1,
        }));
        this.adminData.data = adminData;
        if (this.adminData.data.length) {
          this.isLoading = false;
          this.noData = '';
          this.searching = '';
          this.adminData.sort = this.sort;
          this.adminData.paginator = this.paginator;
        } else {
          this.searching = '';
          this.noData = noResultFound;
          this.isLoading = false;
        }
      },
      error: (error) => {
        this.isLoading = false;
        showDialog(error);
        this.router.navigate(['/dashboard']);
      },
    });
  }

  //Clear Search
  clearSearch() {
    this.searchValue = '';
    this.noData = '';
    return this.ngOnInit();
  }

  //Export Excel
  exportExcel() {
    const adminData = this.adminData.data.map((data: any, index: number) => {
      return [
        index + 1,
        data.username,
        data.email,
        data.phNo ?? '-',
        data.role.name,
      ];
    });
    const columns = [...this.displayedColumns];
    columns.splice(5);
    adminData.length && exportToExcel(adminData, columns, 'AdminData', 'admin');
  }
}
