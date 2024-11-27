import { Directive, ElementRef, HostListener, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appEstadoBadge]',
  standalone: true
})
export class EstadoBadgeDirective {
  @Input() estado?: "Pendiente" | "Aceptado" | "Realizado" | "Rechazado" | "Cancelado";

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.renderer.addClass(this.el.nativeElement, 'badge');
    this.renderer.addClass(this.el.nativeElement, 'p-1');
    this.renderer.addClass(this.el.nativeElement, 'w-100');
    this.renderer.addClass(this.el.nativeElement, 'fs-6');

    if (this.estado == 'Rechazado') {
      this.renderer.setStyle(this.el.nativeElement, 'background-color', '#ff8f39');
      this.renderer.setStyle(this.el.nativeElement, 'color', 'white');
    } else {
      const clases: { [key: string]: string } = {
        Pendiente: 'text-bg-secondary',
        Aceptado: 'text-bg-success',
        Realizado: 'text-bg-primary',
        Cancelado: 'text-bg-danger'
      };
      const clase = clases[this.estado!] || 'text-bg-secondary';
      this.renderer.addClass(this.el.nativeElement, clase);
    }

    this.renderer.setProperty(this.el.nativeElement, 'textContent', this.estado);
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(-2px)');
    this.renderer.setStyle(this.el.nativeElement, 'box-shadow', '0 4px 6px rgba(0, 0, 0, 0.1)');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.renderer.removeStyle(this.el.nativeElement, 'transform');
    this.renderer.removeStyle(this.el.nativeElement, 'box-shadow');
  }

}
