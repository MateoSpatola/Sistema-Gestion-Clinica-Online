import { Component, inject, Input, } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { DatabaseService } from '../../services/database.service';
import { RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';


@Component({
  selector: 'app-form-registro',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatChipsModule,
    MatAutocompleteModule
  ],
  templateUrl: './form-registro.component.html',
  styleUrl: './form-registro.component.css'
})
export class FormRegistroComponent {
  @Input() tipoUsuario?: "paciente" | "especialista" | "administrador";
  private _authService = inject(AuthService);
  private _notificationService= inject(NotificationService);
  private _databaseService = inject(DatabaseService);
  protected mostrarClave: boolean = false;

  protected form = new FormGroup({
    rol: new FormControl('', [Validators.required]),
    habilitado: new FormControl(false),
    nombre: new FormControl('', [Validators.required, Validators.minLength(4)]),
    apellido: new FormControl('', [Validators.required]),
    edad: new FormControl('', [Validators.required, Validators.min(1), Validators.max(120)]),
    dni: new FormControl('', [Validators.required, Validators.min(1000000), Validators.max(100000000)]),
    obraSocial: new FormControl('', [Validators.required]),
    especialidades: new FormControl([], [Validators.required]),
    correo: new FormControl('', [Validators.required, Validators.email]),
    clave: new FormControl('', [Validators.required, Validators.minLength(8)]),
    imagenPerfil: new FormControl('', [Validators.required]),
    imagenPortada: new FormControl('', [Validators.required])
  })

  protected especialidades: string[] = ['Cardiología', 'Dermatología', 'Pediatría', 'Neurología', 'Oncología'];
  protected especialidadesSeleccionadas: string[] = [];
  protected especialidadActual: string = '';

  ngOnInit(): void {
    this.configurarCamposPorTipo();
    if(this.tipoUsuario) {
      this.form.controls.rol.setValue(this.tipoUsuario)
    }
  }

  configurarCamposPorTipo(): void {
    switch (this.tipoUsuario) {
      case 'paciente':
        this.form.controls.especialidades.disable();
        break;
        
      case 'especialista':
        this.form.controls.obraSocial.disable();
        this.form.controls.imagenPortada.disable();
        break;

      case 'administrador':
        this.form.controls.obraSocial.disable();
        this.form.controls.especialidades.disable();
        this.form.controls.imagenPortada.disable();
        break;
    }
  }

  especialidadesFiltradas(): string[] {
    const filtro = this.especialidadActual.toLowerCase();
    return filtro ? this.especialidades.filter(e => e.toLowerCase().includes(filtro) && !this.especialidadesSeleccionadas.includes(e)) : this.especialidades.slice();
  }

  agregarEspecialidad(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value && !this.especialidadesSeleccionadas.includes(value)) {
      this.especialidadesSeleccionadas.push(value);
    }
    event.chipInput!.clear();
    this.especialidadActual = '';
  }

  eliminarEspecialidad(especialidad: string): void {
    const index = this.especialidadesSeleccionadas.indexOf(especialidad);
    if (index >= 0) {
      this.especialidadesSeleccionadas.splice(index, 1);
      this.form.value.especialidades?.splice(index, 1);
    }
  }

  especialidadSeleccionada(event: MatAutocompleteSelectedEvent): void {
    const especialidad = event.option.value;
    if (!this.especialidadesSeleccionadas.includes(especialidad)) {
      this.especialidadesSeleccionadas.push(especialidad);
    }
    event.option.deselect();
    this.especialidadActual = '';
  }

  cambiarVisibilidadClave() {
    this.mostrarClave = !this.mostrarClave;
  }

  async submit(): Promise<void> {
    console.log(this.form.value);
    if (this.form.valid) {
      this._notificationService.showLoadingAlert('Creando cuenta...');
      try {
        await this._authService.signUp(this.form.value.correo!, this.form.value.clave!, this.form.value.nombre!);
        await this._databaseService.setDocument('usuarios', this.form.value, this._authService.auth.currentUser?.uid);
        this.form.reset();
        this._notificationService.closeAlert();

        this._notificationService.showConfirmAlert(
          '¡Registro exitoso!',
          'Te hemos enviado un correo de verificación. Por favor, verifica tu cuenta para poder ingresar.',
          'Ingresar',
          () => this._notificationService.routerLink('/ingreso')
        );


      } catch (error: any) {
        this._notificationService.closeAlert();
        if (error.code === 'auth/email-already-in-use') {
          this._notificationService.showAlert('¡Error: El correo ya está registrado!', 'error', 2000);
        } else if ((error.code === 'auth/invalid-email')) {
          this._notificationService.showAlert('¡Error: El correo ingresado es incorrecto!', 'error', 2000);
        } else {
          this._notificationService.showAlert('Error inesperado: ' + error.code, 'error', 2000);
        }
      }
    }
  }

}
