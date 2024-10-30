import {Component, inject, Input} from '@angular/core';
import {FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-ingreso',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './ingreso.component.html',
  styleUrl: './ingreso.component.css'
})
export class IngresoComponent {

  private _authService = inject(AuthService);
  private _notificationService= inject(NotificationService);

  protected mostrarClave: boolean = false;

  protected form = new FormGroup({
    correo: new FormControl('', [Validators.required, Validators.email]),
    clave: new FormControl('', [Validators.required])
  })

  cambiarVisibilidadClave() {
    this.mostrarClave = !this.mostrarClave;
  }

  async submit(): Promise<void> {
    if (this.form.valid) {
      this._notificationService.showLoadingAlert('Iniciando sesión...');
      try {
        await this._authService.signIn(this.form.value.correo!, this.form.value.clave!);
        this.form.reset();
        this._notificationService.closeAlert();
        this._notificationService.routerLink('');
      } catch (error: any) {
        this._notificationService.closeAlert();
        if (error.code === 'auth/invalid-credential') {
          this._notificationService.showAlert('¡Error: Usuario y/o contraseña incorrectos!', 'error', 2000);
        } else {
          this._notificationService.showAlert('Error inesperado: ' + error.code, 'error', 2000);
        }
      }
    }
  }

  inicioRapido(correo: string, clave: string): void {
    this.form.setValue({ correo, clave });
  }

}
