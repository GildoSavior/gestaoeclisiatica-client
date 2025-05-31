import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { authGuard } from './app/auth.guard';
import { ClientLandingComponent } from './app/pages/client-landing/client-landing.component';


export const appRoutes: Routes = [
    {
      path: '',
      component: AppLayout,
      children: [
        { path: '', component: Landing },
        {
          path: 'client',
          children: [
            { path: '', component: ClientLandingComponent },
            {
              path: 'pages',
              loadChildren: () => import('./app/pages/client-pages/client-pages.routes')
            }
          ]
        },
        {
          path: 'admin',
          children: [
            { path: '', component: Dashboard },
            {
              path: 'pages',
              loadChildren: () => import('./app/pages/admin-pages/admin-pages.routes')
            }
          ]
        },
        { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') },
        { path: 'uikit', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
        { path: 'documentation', component: Documentation }
      ]
    },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
  ];
  
