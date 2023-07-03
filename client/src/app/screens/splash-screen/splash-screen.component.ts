import { Component } from '@angular/core';
import { SplashScreenService } from 'src/app/services/screens/splash-screen.service';

@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss'],
})
export class SplashScreenComponent {
  showSplashScreen = false;

  constructor(private splashScreenService: SplashScreenService) {
    this.splashScreenService.showSplashScreen$.subscribe((value) => {
      this.showSplashScreen = value;
    });
  }
}
