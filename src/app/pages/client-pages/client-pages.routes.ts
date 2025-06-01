// app/pages/client-pages/client-pages.routes.ts
import { Routes } from '@angular/router';
import { EventsComponent } from '../events/events.component';
import { NewsComponent } from '../news/news.component';
import { ConsultationsComponent } from '../consultation/consultation.component';
import { ContribuitionsComponent } from '../contribuitions/contribuitions.component';

export default [
  {
    path: 'events',
    component: EventsComponent
  },
  {
    path: 'consultations',
    component: ConsultationsComponent
  },
  {
    path: 'contributions',
    component: ContribuitionsComponent
  }
] satisfies Routes;
