import { Component, inject } from '@angular/core';
import { DatabaseService } from '../../services/database.service';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    RouterLink,
    MatTableModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule
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

  toggleHabilitado(usuario: any, event: any): void {
    const nuevoEstado = event.checked;
    this._databaseService.updateDocument('usuarios', { habilitado: nuevoEstado }, usuario.correo);
  }

}
