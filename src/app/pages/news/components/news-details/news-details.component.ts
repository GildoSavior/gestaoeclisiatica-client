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
    imports: [ToastModule, FormsModule, CommonModule, ProgressSpinner, DialogModule, ButtonModule, FileUploadModule],
    templateUrl: './news-details.component.html',
    styleUrl: './news-details.component.scss'
})
export class NewsDetailsComponent {
    @Input() news: NewsModel = {} as NewsModel;
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

    onSave(news: NewsModel) {}

    onUpload(news: any) {
        for (const file of news.files) {
            this.uploadedFiles.push(file);
        }

        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    }
}
