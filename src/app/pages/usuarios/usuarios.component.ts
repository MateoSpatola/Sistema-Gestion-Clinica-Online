import { Component, inject } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    RouterLink,
  ],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent {

  private _databaseService = inject(DatabaseService);
  protected usuarios: any[] = [];
  protected displayedColumns: string[] = ['dni', 'nombre', 'apellido', 'tipo', 'habilitado'];

  ngOnInit() {
    this._databaseService.getDocument('usuarios').subscribe(response => {
      this.usuarios = [];
      response.forEach((res: any) => {
        this.usuarios.push(res);
      });
    })
  }

  switchHabilitado(usuario: any, event: any): void {
    const nuevoEstado = event.checked;
    this._databaseService.updateDocument('usuarios', { habilitado: nuevoEstado }, usuario.correo);
  }

}
