import { Directive, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { QuienSoyModalComponent } from '../components/quien-soy-modal/quien-soy-modal.component';

@Directive({
  selector: '[appMostrarQuienSoy]',
  standalone: true
})
export class MostrarQuienSoyDirective {

  private dialogRef: any = null;

  constructor(private dialog: MatDialog) {}

  @HostListener('mouseenter') onMouseEnter() {
    if (!this.dialogRef) {
      this.dialogRef = this.dialog.open(QuienSoyModalComponent, {
        width: '300px',
        hasBackdrop: false,
        panelClass: 'custom-modal'
      });
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.dialogRef) {
      this.dialogRef.close();
      this.dialogRef = null;
    }
  }

}
