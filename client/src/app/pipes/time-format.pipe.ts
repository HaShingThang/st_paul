import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'timeFormat',
})
export class TimeFormatPipe implements PipeTransform {
  transform(value: any): any {
    if (!value) return '';
    return moment(value, 'HH:mm:ss').format('hh:mm A');
  }
}
