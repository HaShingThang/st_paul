import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  releasedYear = 2023;
  currentYear = new Date().getFullYear();
  copyRightYear = this.releasedYear < this.currentYear ? false : true;
}
