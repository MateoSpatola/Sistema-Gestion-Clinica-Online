import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { noAuthAdminGuard } from './guards/no-auth-admin.guard';
import { registroGuard } from './guards/registro.guard';
import { noAuthGuard } from './guards/no-auth.guard';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./pages/inicio/inicio.component').then((m) => m.InicioComponent), data: {animation: 'inicio'} },
    { path: 'registro', loadComponent: () => import('./pages/auth/registro/registro.component').then((m) => m.RegistroComponent), canActivate: [registroGuard], data: {animation: 'registro'} },
    { path: 'ingreso', loadComponent: () => import('./pages/auth/ingreso/ingreso.component').then((m) => m.IngresoComponent), canActivate: [authGuard], data: {animation: 'ingreso'} },
    { path: 'usuarios', loadComponent: () => import('./pages/usuarios/usuarios.component').then((m) => m.UsuariosComponent), canActivate: [noAuthAdminGuard], data: {animation: 'usuarios'} },
    { path: 'perfil', loadComponent: () => import('./pages/perfil/perfil.component').then((m) => m.PerfilComponent), canActivate: [noAuthGuard], data: {animation: 'perfil'} },
    { path: 'solicitar-turno', loadComponent: () => import('./pages/solicitar-turno/solicitar-turno.component').then((m) => m.SolicitarTurnoComponent), canActivate: [noAuthGuard], data: {animation: 'solicitar-turno'} },
    { path: 'turnos', loadComponent: () => import('./pages/turnos/turnos.component').then((m) => m.TurnosComponent), canActivate: [noAuthAdminGuard], data: {animation: 'turnos'} },
    { path: 'mis-turnos', loadComponent: () => import('./pages/mis-turnos/mis-turnos.component').then((m) => m.MisTurnosComponent), canActivate: [noAuthGuard], data: {animation: 'mis-turnos'} },
    { path: 'pacientes', loadComponent: () => import('./pages/pacientes/pacientes.component').then((m) => m.PacientesComponent), canActivate: [noAuthGuard], data: {animation: 'pacientes'} },
    { path: 'estadisticas', loadComponent: () => import('./pages/estadisticas/estadisticas.component').then((m) => m.EstadisticasComponent), canActivate: [noAuthAdminGuard], data: {animation: 'estadisticas'} },
];
