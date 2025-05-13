import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NewsModel } from '../../../../models/news.model';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProgressSpinner } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'app-news-details',
    imports: [ToastModule, FormsModule, CommonModule, ProgressSpinner, DialogModule],
    templateUrl: './news-details.component.html',
    styleUrl: './news-details.component.scss'
})
export class NewsDetailsComponent {
    @Input() news: NewsModel = {} as NewsModel;
    @Input() visible: boolean = false;
    @Input() submitted: boolean = false;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() save = new EventEmitter<void>();

    isLoading = false;

    hideDialog() {
        this.visibleChange.emit(false);
    }

    onSave(news: NewsModel) {}
}
