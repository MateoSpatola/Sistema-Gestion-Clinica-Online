import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatoDni',
  standalone: true
})
export class FormatoDniPipe implements PipeTransform {

  transform(value: number | string): string {
    if (!value) return '';

    const strValue = value.toString();
    
    const formattedValue = strValue.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

    return formattedValue;
  }

}
