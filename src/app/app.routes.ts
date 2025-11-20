import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },

    {
        path: 'login',
        loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent)
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent),
        canActivate: [authGuard],
    },
    {
        path: 'taskdetail/:id',
        loadComponent: () => import('./pages/taskdetail/taskdetail').then(m => m.TaskDetail),
        canActivate: [authGuard],
    },
    {
        path: '**',
        redirectTo: 'dashboard',
    },
];
