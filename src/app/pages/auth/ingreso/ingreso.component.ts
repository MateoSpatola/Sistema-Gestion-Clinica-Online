import {Component, inject, Input} from '@angular/core';
import {FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { DatabaseService } from '../../../services/database.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-ingreso',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    NgClass
  ],
  templateUrl: './ingreso.component.html',
  styleUrl: './ingreso.component.css'
})
export class IngresoComponent {

  private _authService = inject(AuthService);
  private _notificationService= inject(NotificationService);
  private _databaseService = inject(DatabaseService);

  protected mostrarClave: boolean = false;
  protected mostrarInicioRapido: boolean = false;

  protected form = new FormGroup({
    correo: new FormControl('', [Validators.required, Validators.email]),
    clave: new FormControl('', [Validators.required])
  })

  protected usuariosInicioRapido = [
    { correo: 'pocisi5735@cironex.com', nombre: 'Paciente 3', imagenPerfil: 'https://firebasestorage.googleapis.com/v0/b/spatolamateo-clinicaonline.appspot.com/o/usuarios%2Fpocisi5735%40cironex.com_perfil?alt=media&token=13ca3825-2126-4ba8-81b5-be69a32ffabb' },
    { correo: 'limisob657@edectus.com', nombre: 'Paciente 2', imagenPerfil: 'https://firebasestorage.googleapis.com/v0/b/spatolamateo-clinicaonline.appspot.com/o/usuarios%2Flimisob657%40edectus.com_perfil?alt=media&token=66dae98b-c438-4174-800d-4b99d505bad8' },
    { correo: 'vimeke4389@cironex.com', nombre: 'Paciente 1', imagenPerfil: 'https://firebasestorage.googleapis.com/v0/b/spatolamateo-clinicaonline.appspot.com/o/usuarios%2Fvimeke4389%40cironex.com_perfil?alt=media&token=adb307f6-1700-4aa5-8fc6-87d4c2fca97f' },
    { correo: 'xekome6295@edectus.com', nombre: 'Especialista 2', imagenPerfil: 'https://firebasestorage.googleapis.com/v0/b/spatolamateo-clinicaonline.appspot.com/o/usuarios%2Fxekome6295%40edectus.com_perfil?alt=media&token=55ad0c9a-8445-4563-9cdf-1c75a03564df' },
    { correo: 'jelahel730@cironex.com', nombre: 'Especialista 1', imagenPerfil: 'https://firebasestorage.googleapis.com/v0/b/spatolamateo-clinicaonline.appspot.com/o/usuarios%2Fjelahel730%40cironex.com_perfil?alt=media&token=e73d8b77-b8c5-4ec0-8f73-b05b28e1c1ad' },
    { correo: 'hoside1533@gianes.com', nombre: 'Administrador', imagenPerfil: 'https://firebasestorage.googleapis.com/v0/b/spatolamateo-clinicaonline.appspot.com/o/usuarios%2Fhoside1533%40gianes.com_perfil?alt=media&token=4c8df6de-0e35-4573-8828-90fdd24d74a9' }
  ];

  inicioRapido(correo: string, clave: string): void {
    this.form.setValue({ correo, clave });
  }

  cambiarVisibilidadClave() {
    this.mostrarClave = !this.mostrarClave;
  }

  async submit(): Promise<void> {
    if (this.form.valid) {
      this._notificationService.showLoadingAlert('Iniciando sesión...');
      try {
        const userCredential = await this._authService.signIn(this.form.value.correo!, this.form.value.clave!);
        if (!userCredential.user?.emailVerified) {
          await this._authService.signOut();
          this._notificationService.closeAlert();
          this._notificationService.showVerificationAlert(
            'Debes verificar tu correo electrónico para acceder.',
            'Reenviar correo de verificación',
            async () => {
              await this._authService.sendVerificationEmail(userCredential.user);
              this._notificationService.showAlert(
                '¡Correo de verificación reenviado!',
                'success',
                3000
              );
            }
          );
        }
        else {
          const usuario = await this._databaseService.getDocumentById('usuarios', userCredential.user.email!);
          if (!usuario!.habilitado) {
            await this._authService.signOut();
            this._notificationService.showAlert('¡Error: Usuario inhabilitado, comuniquese con un administrador!', 'error', 3000);
          }
          else {
            this.form.reset();
            this._notificationService.closeAlert();
            this._notificationService.routerLink('');
          }
        }
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

}
