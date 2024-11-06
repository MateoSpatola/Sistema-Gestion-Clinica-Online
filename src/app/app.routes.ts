import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { noAuthAdminGuard } from './guards/no-auth-admin.guard';
import { registroGuard } from './guards/registro.guard';
import { noAuthGuard } from './guards/no-auth.guard';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./pages/inicio/inicio.component').then((m) => m.InicioComponent) },
    { path: 'registro', loadComponent: () => import('./pages/auth/registro/registro.component').then((m) => m.RegistroComponent), canActivate: [registroGuard] },
    { path: 'ingreso', loadComponent: () => import('./pages/auth/ingreso/ingreso.component').then((m) => m.IngresoComponent), canActivate: [authGuard] },
    { path: 'usuarios', loadComponent: () => import('./pages/usuarios/usuarios.component').then((m) => m.UsuariosComponent), canActivate: [noAuthAdminGuard] },
    { path: 'perfil', loadComponent: () => import('./pages/perfil/perfil.component').then((m) => m.PerfilComponent), canActivate: [noAuthGuard] },
];
