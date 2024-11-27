import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'linkCorreo',
  standalone: true
})
export class LinkCorreoPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(value)) {
      return `<a href="mailto:${value}">${value}</a>`;
    }
    return value;
  }

}
