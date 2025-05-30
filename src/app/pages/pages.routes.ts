import { Routes } from '@angular/router';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { EventsComponent } from './events/events.component';
import { UsersComponent } from './users/users.component';
import { DepartamentosComponent } from './departamentos/departamentos.component';
import { PositionsComponent } from './positions/positions.component';
import { ConsultationsComponent } from './consultation/consultation.component';
import { NewsComponent } from './news/news.component';
import { ContribuitionsComponent } from './contribuitions/contribuitions.component';

export default [
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
