// app/pages/admin-pages/admin-pages.routes.ts
import { Routes } from '@angular/router';
import { EventsComponent } from '../events/events.component';
import { NewsComponent } from '../news/news.component';
import { UsersComponent } from '../users/users.component';
import { DepartamentosComponent } from '../departamentos/departamentos.component';
import { PositionsComponent } from '../positions/positions.component';
import { ConsultationsComponent } from '../consultation/consultation.component';

import { ContribuitionsComponent } from '../contribuitions/contribuitions.component';

export default [
    {
        path: 'events',
        component: EventsComponent
    },
    {
        path: 'news',
        component: NewsComponent
    },
    { 
        path: 'users',
        component: UsersComponent 
    },
    { 
        path: 'departments', 
        component: DepartamentosComponent 
    },
    {
        path: 'positions', 
        component: PositionsComponent 
    },
    { 
        path: 'consultations', 
        component: ConsultationsComponent 
    },
    { 
        path: 'contribuicoes', 
        component: ContribuitionsComponent 
    }
] satisfies Routes;
