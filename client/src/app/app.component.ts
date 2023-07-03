import { Component } from '@angular/core';
import { SplashScreenService } from './services/screens/splash-screen.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  showSplashScreen = true;

  constructor(private splashScreenService: SplashScreenService) {}

  ngOnInit() {
    this.splashScreenService.showSplashScreen();

    setTimeout(() => {
      this.showSplashScreen = false;
      this.splashScreenService.hideSplashScreen();
    }, 2000);
  }
}
