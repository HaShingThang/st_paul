import { Component, Input } from '@angular/core';
import { SplashScreenService } from 'src/app/services/screens/splash-screen.service';
import { searching } from '../../constants/messages';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss'],
})
export class LoadingScreenComponent {
@Input() searching?: string;
}
