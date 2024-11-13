import { Component, inject, Input, } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { DatabaseService } from '../../services/database.service';
import { RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule, MAT_CHIPS_DEFAULT_OPTIONS } from '@angular/material/chips';
import { COMMA, SPACE } from '@angular/cdk/keycodes';
import { Especialidad } from '../../models/especialidad';
import { RecaptchaModule, RecaptchaFormsModule } from "ng-recaptcha";

@Component({
  selector: 'app-form-registro',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatChipsModule,
    MatAutocompleteModule,
    RecaptchaModule,
    RecaptchaFormsModule
  ],
  providers: [
    {
      provide: MAT_CHIPS_DEFAULT_OPTIONS,
      useValue: {
        separatorKeyCodes: [COMMA, SPACE]
      }
    }
  ],
  templateUrl: './form-registro.component.html',
  styleUrl: './form-registro.component.css'
})
export class FormRegistroComponent {
  @Input() tipoUsuario?: "Paciente" | "Especialista" | "Administrador";
  @Input() altaDesdeUnAdmin: boolean = false;

  private _authService = inject(AuthService);
  private _notificationService= inject(NotificationService);
  private _databaseService = inject(DatabaseService);

  protected mostrarClave: boolean = false;
  protected especialidades: Especialidad[] = [];
  protected especialidadesSeleccionadas: string[] = [];
  protected especialidadActual: string = '';
  protected imagenPerfil!: Event;
  protected imagenPortada!: Event;

  protected form = new FormGroup({
    tipo: new FormControl('', [Validators.required]),
    habilitado: new FormControl(true),
    nombre: new FormControl('', [Validators.required, Validators.minLength(4)]),
    apellido: new FormControl('', [Validators.required]),
    edad: new FormControl('', [Validators.required, Validators.min(1), Validators.max(120)]),
    dni: new FormControl('', [Validators.required, Validators.min(1000000), Validators.max(100000000)]),
    obraSocial: new FormControl('', [Validators.required]),
    especialidades: new FormControl([], [Validators.required]),
    correo: new FormControl('', [Validators.required, Validators.email]),
    clave: new FormControl('', [Validators.required, Validators.minLength(8)]),
    imagenPerfil: new FormControl('', [Validators.required]),
    imagenPortada: new FormControl('', [Validators.required]),
    recaptcha: new FormControl('', [Validators.required])
  })


  ngOnInit(): void {
    this.configurarCamposPorTipo();
    if(this.tipoUsuario) {
      this.form.controls.tipo.setValue(this.tipoUsuario);
    }

    this._databaseService.getDocument('especialidades').subscribe(response => {
      response.forEach((res: any) => {
        this.especialidades.push(res);
      });
    });
  }

  configurarCamposPorTipo(): void {
    switch (this.tipoUsuario) {
      case 'Paciente':
        this.form.controls.especialidades.disable();
        break;
        
      case 'Especialista':
        this.form.controls.habilitado.setValue(false);
        this.form.controls.obraSocial.disable();
        this.form.controls.imagenPortada.disable();
        break;

      case 'Administrador':
        this.form.controls.obraSocial.disable();
        this.form.controls.especialidades.disable();
        this.form.controls.imagenPortada.disable();
        break;
    }
  }

  especialidadesFiltradas(): Especialidad[] {
    const filtro = this.especialidadActual.toLowerCase();
    return filtro ? this.especialidades.filter(e => e.nombre.toLowerCase().includes(filtro) && !this.especialidadesSeleccionadas.includes(e.nombre)) : this.especialidades.slice();
  }

  agregarEspecialidad(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    const especialidad = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    if (especialidad && !this.especialidadesSeleccionadas.includes(especialidad)) {
      this.especialidadesSeleccionadas.push(especialidad);
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

  async cargarImagen($event: Event, collection: string, imageName: string): Promise<string> {
    const inputElement = $event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files[0]) {
      const file = inputElement.files[0];
      const blob = new Blob([file], {type: file.type});
      return await this._databaseService.uploadImage(collection, blob, imageName);
    }
    return '';
  }

  async submit(): Promise<void> {
    if (this.form.valid) {
      this._notificationService.showLoadingAlert('Creando cuenta...');
      this._authService.generatingUser = true;
      try {
        await this._authService.signUp(this.form.value.correo!, this.form.value.clave!, this.form.value.tipo!);
        this.form.controls.clave.disable();

        const urlImagenPerfil = await this.cargarImagen(this.imagenPerfil, 'usuarios', this.form.value.correo! + '_perfil')
        this.form.value.imagenPerfil = urlImagenPerfil;

        if (this.tipoUsuario == "Paciente") {
          const urlImagenPortada = await this.cargarImagen(this.imagenPortada, 'usuarios', this.form.value.correo! + '_portada')
          this.form.value.imagenPortada = urlImagenPortada;
        }
        
        await this._databaseService.setDocument('usuarios', this.form.value, this.form.value.correo!);

        const especialidadesParaAgregar = this.especialidadesSeleccionadas.filter((especialidad) => {
          return !this.especialidades.some(e => e.nombre == especialidad);
        });

        for (const especialidad of especialidadesParaAgregar) {
          await this._databaseService.setDocument('especialidades', { 
            nombre: especialidad, 
            imagen: 'https://firebasestorage.googleapis.com/v0/b/spatolamateo-clinicaonline.appspot.com/o/especialidades%2Fdefault.png?alt=media&token=ad876f92-3dd7-42ba-9944-e541b73cf103' 
          }, especialidad);
        }

        this.form.reset();
        this.form.markAsUntouched();
        this._notificationService.closeAlert();

        if (this.altaDesdeUnAdmin) {
          this._notificationService.routerLink('/usuarios');
          this._notificationService.showAlert('¡Cuenta creada! Recuerda verificar el correo.', 'success', 2000);
        }
        else {
          this._notificationService.showConfirmAlert(
            '¡Registro exitoso!',
            'Te hemos enviado un correo de verificación. Por favor, verifica tu cuenta para poder ingresar.',
            'Ingresar',
            () => this._notificationService.routerLink('/ingreso')
          );
        }
        
      } catch (error: any) {
        this.form.controls.clave.enable();
        this._notificationService.closeAlert();
        if (error.code === 'auth/email-already-in-use') {
          this._notificationService.showAlert('¡Error: El correo ya está registrado!', 'error', 2000);
        } else if ((error.code === 'auth/invalid-email')) {
          this._notificationService.showAlert('¡Error: El correo ingresado es incorrecto!', 'error', 2000);
        } else {
          this._notificationService.showAlert('Error inesperado: ' + error.code, 'error', 2000);
        }
      } finally {
        this._authService.generatingUser = false;
      }
    }
    else {
      this.form.markAllAsTouched();
    }
  }

}
