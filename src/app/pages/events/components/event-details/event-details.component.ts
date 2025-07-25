import { Component, Input, Output, EventEmitter } from '@angular/core';
import { EventModel } from '../../../../models/event.model';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { EnumEventType, EventStatus } from '../../../../models/enums/enums';
import { MessageService } from 'primeng/api';
import { FileUploadModule } from 'primeng/fileupload';
import { EventService } from '../../../../service/event.service';
import { User } from '../../../../models/user.model';
import { UserService } from '../../../../service/user/user.service';
import { ApiResponse } from '../../../../dto/reponses';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { Router } from '@angular/router';
import { ModeUtil } from '../../../../mode.utils';
import { UserUtil } from '../../../../service/user/userUtils';

@Component({
    selector: 'app-event-details',
    templateUrl: './event-details.component.html',
    imports: [DialogModule, FormsModule, DropdownModule, ButtonModule, ToastModule, ProgressSpinnerModule, CommonModule, FileUploadModule, AutoCompleteModule],
    standalone: true
})
export class EventDetailsComponent {
    mode: 'admin' | 'client' = 'client';

    constructor(
        private readonly messageService: MessageService,
        private readonly eventService: EventService,
        private readonly userService: UserService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.mode = ModeUtil.getCurrentMode(this.router.url);
        this.populateUsers();
    }

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

    eventTypeOptions = Object.entries(EnumEventType).map(([key, value]) => ({
        name: value,
        value: key
    }));
    eventType: EnumEventType | null = null;

    uploadedFiles: any[] = [];

    filteredUsers: User[] = [];
    users: User[] = [];

    getFullName(user: User): string {
        return `${user.name} ${user.lastName}`;
    }

    filterUser(event: any) {
        const query = event.query.toLowerCase();
        this.filteredUsers = this.users
            .filter((user) => this.getFullName(user).toLowerCase().includes(query))
            .map((user) => ({
                ...user,
                fullName: this.getFullName(user)
            }));
    }

    populateUsers() {
        this.userService.getAllUsers().subscribe(
            (response: Partial<ApiResponse<User[]>>) => {
                // Permite que 'ok' seja opcional
                if (response?.data) {
                    this.users = response.data;
                }
            },

            (error: any) => {
                this.showError('Erro ao buscar utilizadores:' + error);
            }
        );
    }

    private showError(message: string) {
        this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: message
        });
    }

    hideDialog() {
        this.visibleChange.emit(false);
    }

    onSave(event: EventModel) {
        const email = UserUtil.getUserData()?.email;
        if (this.mode === 'client' && email) {
            event.eventStatus = 'PENDING';
            event.userEmail = email; 
        }

        this.isLoading = true;

        const saveObservable = event.id ? this.eventService.updateEvent(event.id, event) : this.eventService.createEvent(event);

        saveObservable.subscribe({
            next: (response: any) => {
                const savedEvent = response.data;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Evento salvo com sucesso.'
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
                    detail: err?.error?.message || 'Falha ao salvar o evento.'
                });
            }
        });
    }

    uploadImages(eventId: number) {
        const formData = new FormData();
        for (const file of this.uploadedFiles) {
            formData.append('files', file);
        }

        this.eventService.uploadImages(eventId, formData).subscribe({
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

    finishSaving() {
        this.isLoading = false;
        this.hideDialog();
        this.save.emit();
        this.uploadedFiles = []; // limpa o estado dos arquivos
    }

    onUpload(event: any) {
        for (const file of event.files) {
            this.uploadedFiles.push(file);
        }

        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    }
}
