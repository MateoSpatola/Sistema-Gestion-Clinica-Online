import { Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNow, format } from 'date-fns';
import { es } from 'date-fns/locale';

@Pipe({
  name: 'fechaRelativa',
  standalone: true
})
export class FechaRelativaPipe implements PipeTransform {

  transform(value: Date | string): string {
    if (!value) return '';

    const date = new Date(value);
    const formattedDate = format(date, 'dd/MM/yyyy - hh:mm a', { locale: es });
    const relativeTime = formatDistanceToNow(date, { addSuffix: true, locale: es }).replace('alrededor de ', '');

    return `${formattedDate} (${relativeTime})`;
  }

}
