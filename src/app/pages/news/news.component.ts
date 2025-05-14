import { Component, signal, ViewChild } from '@angular/core';
import { NewsModel } from '../../models/news.model';
import { Table, TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { NewsService } from '../../service/news/news.service';
import { HttpResponse } from '../../dto/http-response.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { InputIconModule } from 'primeng/inputicon';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { NewsDetailsComponent } from './components/news-details/news-details.component';

interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}

@Component({
    selector: 'app-news',
    imports: [
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule,
        NewsDetailsComponent,
        ToastModule,
    ],
    providers: [ConfirmationService],
    templateUrl: './news.component.html',
    styleUrl: './news.component.scss'
})
export class NewsComponent {
    newsDialog: boolean = false;

    Allnews = signal<NewsModel[]>([]);

    news!: NewsModel;

    selectedNews!: NewsModel | null;

    submitted: boolean = false;

    statuses!: any[];

    @ViewChild('dt') dt!: Table;

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private readonly newsService: NewsService,
        private readonly messageService: MessageService,
        private readonly confirmationService: ConfirmationService
    ) {}

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit() {
        this.loadDemoData();
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
    loadDemoData() {
        this.newsService.getAllNews().subscribe(
            (response: HttpResponse<NewsModel[]>) => {
                this.Allnews.set(response.data);
            },

            (error) => {
                console.error('Erro ao buscar eventos:', error);
            }
        );

        this.cols = [
            { field: 'image', header: 'Imagem' },
            { field: 'title', header: 'Titúlo' },
            { field: 'content', header: 'Conteúdo' },
            { field: 'publishDate', header: 'Data publicação' },
            { field: 'author', header: 'Autor' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    deleteNews(news: NewsModel) {}
    editNews(news: NewsModel) {}
    deleteSelectedNews() {}

    openNew() {
        this.news = {
            id: null,
            title: '',
            content: '',
            publishDate: '',
            author: '',
            imagesUrls: []
        };
        this.submitted = false;
        this.newsDialog = true;
    }

    saveNews(news: NewsModel) {}
}
