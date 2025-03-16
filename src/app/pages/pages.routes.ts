import { Routes } from '@angular/router';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { EventsComponent } from './events/events.component';
import { UsersComponent } from './users/users.component';
import { DepartamentosComponent } from './departamentos/departamentos.component';
import { PositionsComponent } from './positions/positions.component';

export default [
    { path: 'events', component: EventsComponent },
    { path: 'users', component: UsersComponent },
    { path: 'departments', component: DepartamentosComponent },
    { path: 'positions', component: PositionsComponent },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
