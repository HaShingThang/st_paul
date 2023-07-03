import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SplashScreenService {
  private showSplashScreenSubject = new BehaviorSubject<boolean>(false);
  public showSplashScreen$ = this.showSplashScreenSubject.asObservable();

  showSplashScreen() {
    this.showSplashScreenSubject.next(true);
  }

  hideSplashScreen() {
    this.showSplashScreenSubject.next(false);
  }
}
