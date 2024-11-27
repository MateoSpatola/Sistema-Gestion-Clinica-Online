import { Directive, ElementRef, Input, Renderer2, HostListener } from '@angular/core';
import { formatDistanceToNow, isFuture } from 'date-fns';
import { es } from 'date-fns/locale';

@Directive({
  selector: '[appFechaInteractiva]',
  standalone: true
})
export class FechaInteractivaDirective {
  @Input('appFechaInteractiva') fecha?: Date | string;

  private textoOriginal: string | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    if (!this.fecha) return;

    if (this.textoOriginal == null) {
      this.textoOriginal = this.el.nativeElement.textContent.trim();
    }

    const fecha = new Date(this.fecha);
    const fechaRelativa = formatDistanceToNow(fecha, { addSuffix: true, locale: es }).replace('alrededor de ', '');

    const colorTexto = isFuture(fecha) ? 'text-primary' : 'text-danger';

    this.renderer.addClass(this.el.nativeElement, colorTexto);
    this.renderer.setStyle(this.el.nativeElement, 'font-weight', 'bold');
    this.renderer.setStyle(this.el.nativeElement, 'font-size', '1.2rem');

    this.renderer.setProperty(this.el.nativeElement, 'textContent', fechaRelativa);
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.textoOriginal != null) {
      this.renderer.setProperty(this.el.nativeElement, 'textContent', this.textoOriginal);
      this.renderer.removeClass(this.el.nativeElement, 'text-primary');
      this.renderer.removeClass(this.el.nativeElement, 'text-danger');
      this.renderer.removeStyle(this.el.nativeElement, 'font-weight');
      this.renderer.removeStyle(this.el.nativeElement, 'font-size');
    }
  }
}
