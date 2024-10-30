import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./pages/inicio/inicio.component').then((m) => m.InicioComponent) },
    { path: 'registro', loadComponent: () => import('./pages/auth/registro/registro.component').then((m) => m.RegistroComponent) },
    { path: 'ingreso', loadComponent: () => import('./pages/auth/ingreso/ingreso.component').then((m) => m.IngresoComponent) },
];
