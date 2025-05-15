import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NewsModel } from '../../../../models/news.model';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProgressSpinner } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { NewsService } from '../../../../service/news/news.service';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'app-news-details',
    imports: [ToastModule, FormsModule, CommonModule, ProgressSpinner, DialogModule, ButtonModule, FileUploadModule, FileUploadModule],
    templateUrl: './news-details.component.html',
    styleUrl: './news-details.component.scss'
})
export class NewsDetailsComponent {
    // @Input() news: any;

    @Input() news: NewsModel = {
        id: null,
        title: '',
        content: '',
        author: '',
        publishDate: '',
        imagesUrls: null
      };
    @Input() visible: boolean = false;
    @Input() submitted: boolean = false;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() save = new EventEmitter<void>();

    constructor(
      private readonly messageService: MessageService,
      private readonly newsService: NewsService,
    
  ) {}

    uploadedFiles: any[] = [];

    isLoading = false;

    hideDialog() {
        this.visibleChange.emit(false);
    }

    onSave(news: NewsModel) {
      this.isLoading = true;

      const saveObservable = news.id ? this.newsService.updateNews(news.id, news) : this.newsService.createNews(news);

      saveObservable.subscribe({
          next: (response: any) => {
              const savedEvent = response.data;
              this.messageService.add({
                  severity: 'success',
                  summary: 'Sucesso',
                  detail: 'Noticia criada com sucesso.'
              });

              if (this.uploadedFiles.length > 0) {
                  this.uploadImages(savedEvent.id);
              } else {
                  this.finishSaving();
              }
          },
          error: (err) => {
              this.isLoading = false;
              this.messageService.add({
                  severity: 'error',
                  summary: 'Erro',
                  detail: err?.error?.message || 'Falha ao salvar a noticia.'
              });
          }
      });
    }

    onUpload(news: any) {
        for (const file of news.files) {
            this.uploadedFiles.push(file);
        }

        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    }

     finishSaving() {
        this.isLoading = false;
        this.hideDialog();
        this.save.emit();
        this.uploadedFiles = []; // limpa o estado dos arquivos
    }
    uploadImages(newsId: number) {
        const formData = new FormData();
        for (const file of this.uploadedFiles) {
            formData.append('files', file);
        }

        this.newsService.uploadImages(newsId, formData).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Imagens enviadas com sucesso.'
                });
                this.finishSaving();
            },
            error: (err) => {
                this.isLoading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: err?.error?.message || 'Falha ao enviar imagens.'
                });
            }
        });
    }
}
