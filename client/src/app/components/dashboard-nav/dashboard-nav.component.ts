import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dashboard-nav',
  templateUrl: './dashboard-nav.component.html',
  styleUrls: ['./dashboard-nav.component.scss'],
})
export class DashboardNavComponent {
  @Input() dashboardLink!: string;
  @Input() routerLink!: string;
  @Input() routerType!: string;
}
