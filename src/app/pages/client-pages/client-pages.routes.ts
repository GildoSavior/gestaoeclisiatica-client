// app/pages/client-pages/client-pages.routes.ts
import { Routes } from '@angular/router';
import { EventsComponent } from '../events/events.component';
import { NewsComponent } from '../news/news.component';

export default [
  {
    path: 'events',
    component: EventsComponent
  },
  {
    path: 'news',
    component: NewsComponent
  }
] satisfies Routes;
