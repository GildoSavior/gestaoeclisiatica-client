import { Component } from '@angular/core';
import { NotificationsWidget } from './components/notificationswidget';
import { StatsWidget } from './components/statswidget';
import { RecentNewsWidget } from './components/recentsaleswidget';
import { BestSellingWidget } from './components/bestsellingwidget';
import { RevenueStreamWidget } from './components/revenuestreamwidget';
import { UserConversionWidget } from './components/userconversionwidget'; // <-- importado
import { EventStatusWidget } from './components/EventStatusWidget'; // <-- novo componente importado
import { ConsultationStatusWidget } from './components/ConsultationStatusWidget';

@Component({
  selector: 'app-dashboard',
  imports: [
    StatsWidget,
    RecentNewsWidget,
    BestSellingWidget,
    RevenueStreamWidget,
    NotificationsWidget,
    UserConversionWidget,
    EventStatusWidget,
    ConsultationStatusWidget // <--- novo componente adicionado
  ],
  template: `
    <div class="grid grid-cols-12 gap-8">
      <app-stats-widget class="contents" />
      <div class="col-span-12 xl:col-span-6">
        <app-recent-news-widget />
        <app-best-selling-widget />
        <app-event-status-widget /> <!-- novo -->
      </div>
      <div class="col-span-12 xl:col-span-6">
        <app-revenue-stream-widget />
        <app-user-conversion-widget />
        <app-consultation-status-widget />
      </div>
    </div>
  `
})
export class Dashboard {}

