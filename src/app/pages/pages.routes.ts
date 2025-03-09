import { Routes } from '@angular/router';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { EventsComponent } from './events/events.component';
import { UsersComponent } from './users/users.component';


export default [
    { path: 'events', component: EventsComponent },
    { path: 'users', component: UsersComponent },

    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
