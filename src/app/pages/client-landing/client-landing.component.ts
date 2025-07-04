import { Component } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';
import { CarouselModule } from 'primeng/carousel';
import { PhotoService } from '../../service/photo.service';
import { EventService } from '../../service/event.service';
import { NewsService } from '../../service/news/news.service';
import { EventModel } from '../../models/event.model';
import { NewsModel } from '../../models/news.model';

@Component({
    selector: 'app-client-landing',
    standalone: true,
    imports: [GalleriaModule, CarouselModule],
    templateUrl: './client-landing.component.html',
    styleUrl: './client-landing.component.scss',
    providers: [PhotoService, NewsService]
})
export class ClientLandingComponent {
    events: EventModel[] = [];
    formattedEvents: {
        title: string;
        description: string;
        initialDate: string;
        finalDate: string;
        galleryImages: { itemImageSrc: string; thumbnailImageSrc: string }[];
    }[] = [];

    news: NewsModel[] = [];
    formattedNews: {
        title: string;
        content: string;
        author: string;
        publishDate: string;
        imageUrl: string;
    }[] = [];

    galleriaResponsiveOptions = [
        { breakpoint: '1024px', numVisible: 5 },
        { breakpoint: '960px', numVisible: 4 },
        { breakpoint: '768px', numVisible: 3 },
        { breakpoint: '560px', numVisible: 1 }
    ];

    constructor(
        private eventService: EventService,
        private newsService: NewsService
    ) {}

    ngOnInit() {
        this.loadEvents();
        this.loadNews();
    }

    private loadEvents() {
        this.eventService.getAllEvents().subscribe({
            next: (response: { message: string; data: EventModel[] }) => {
                this.events = response.data || [];
                this.formattedEvents = this.events.map(event => ({
                    title: event.title,
                    description: event.description,
                    initialDate: event.initialDate,
                    finalDate: event.finalDate,
                    galleryImages: event.imagesUrls.map(url => ({
                        itemImageSrc: url,
                        thumbnailImageSrc: url
                    }))
                }));
            },
            error: (err) => console.error('Erro ao carregar eventos:', err)
        });
    }

    private loadNews() {
        this.newsService.getAllNews().subscribe({
            next: (response: { message: string; data: NewsModel[] }) => {
                this.news = response.data || [];
                this.formattedNews = this.news.map(news => ({
                  title: news.title ?? '',
                  content: news.content ?? '',
                  author: news.author ?? '',
                  publishDate: news.publishDate ?? '',
                  imageUrl: news.imagesUrls?.[0] ?? ''
              }));
            },
            error: (err) => console.error('Erro ao carregar notícias:', err)
        });
    }
}
