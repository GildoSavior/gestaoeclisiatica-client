import { Component, Input, Output, EventEmitter } from '@angular/core';
import { EventModel } from '../../../../models/event.model';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { Enum_EventType, EventStatus } from '../../../../models/enums/enums';
import { MessageService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
    selector: 'app-event-details',
    templateUrl: './event-details.component.html',
    imports: [DialogModule, FormsModule, DropdownModule, ButtonModule, ToastModule, ProgressSpinnerModule, CommonModule, FileUploadModule],
    standalone: true
})
export class EventDetailsComponent {
    constructor(private messageService: MessageService) {}

    @Input() event: EventModel = {} as EventModel;
    @Input() visible: boolean = false;
    @Input() submitted: boolean = false;
    isLoading = false;

    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() save = new EventEmitter<void>();

    eventStatusOptions = Object.entries(EventStatus).map(([key, value]) => ({
        name: value,
        value: key
    }));
    eventStatus: EventStatus | null = null;

    eventTypeOptions = Object.entries(Enum_EventType).map(([key, value]) => ({
        name: value,
        value: key
    }));
    eventType: Enum_EventType | null = null;

    uploadedFiles: any[] = [];

    hideDialog() {
        this.visibleChange.emit(false);
    }

    onSave(event: EventModel) {
        this.save.emit();
    }

    onUpload(event: any) {
        for (const file of event.files) {
            this.uploadedFiles.push(file);
        }

        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    }
}
