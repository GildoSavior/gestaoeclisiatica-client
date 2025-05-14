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

    deleteNews(news: NewsModel) {
        if (!this.selectedNews?.id) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Aviso',
                detail: 'Nenhuma noticia selecionada para excluir.',
                life: 3000
            });
            return;
        }
    
        this.confirmationService.confirm({
            message: 'Tem a certeza que pretende eliminar esta noticia?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.newsService.deleteNews(this.selectedNews?.id ?? null).subscribe({
                    next: () => {
                        this.selectedNews = null;
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Evento eliminado com sucesso',
                            life: 3000
                        });
                    },
                    error: (error) => {
                        console.error('Erro ao excluir noticia:', error);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro',
                            detail: 'Erro ao eliminar noticia',
                            life: 3000
                        });
                    }
                });
            }
        });
    }
    editNews(news: NewsModel) {
        this.news = { ...news };
        this.submitted = false;
        this.newsDialog = true;
    }
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
