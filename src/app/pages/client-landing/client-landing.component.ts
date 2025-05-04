import { Component } from '@angular/core';
import { PhotoService } from '../../service/photo.service';
import { GalleriaModule } from 'primeng/galleria';
import { EventModel } from '../../models/event.model';
import { EventService } from '../../service/event.service';
import { CarouselModule } from 'primeng/carousel';


@Component({
    selector: 'app-client-landing',
    imports: [GalleriaModule, CarouselModule],
    templateUrl: './client-landing.component.html',
    styleUrl: './client-landing.component.scss',
    providers: [PhotoService]
})
export class ClientLandingComponent {
  events: EventModel[] = [];
  formattedEvents: { title: string; description: string; initialDate: string; finalDate: string; galleryImages: any[] }[] = [];

  galleriaResponsiveOptions = [
    { breakpoint: '1024px', numVisible: 5 },
    { breakpoint: '960px', numVisible: 4 },
    { breakpoint: '768px', numVisible: 3 },
    { breakpoint: '560px', numVisible: 1 }
  ];

  constructor(private eventService: EventService) {}

  ngOnInit() {
    this.eventService.getAllEvents().subscribe(
      (response: { message: string; data: EventModel[] }) => {
        this.events = response.data;
        this.formattedEvents = this.events.map(event => ({
          ...event,
          galleryImages: event.imagesUrls.map(url => ({
            itemImageSrc: url,
            thumbnailImageSrc: url
          }))
        }));
      },
      (error: any) => {
        console.error('Erro ao carregar eventos', error);
      }
    );
  }
}
