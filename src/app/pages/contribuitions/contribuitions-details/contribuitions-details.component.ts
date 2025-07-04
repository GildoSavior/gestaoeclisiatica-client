import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CabecContrib } from '../../../models/cabec-contrib.model';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { CabecService } from '../../../service/contrib/contrib.service';
import { EventModel } from '../../../models/event.model';
import { EventService } from '../../../service/event.service';
import { ApiResponse } from '../../../dto/reponses';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FileUploadModule } from 'primeng/fileupload';
import { ContribStatus, ContribType } from '../../../models/enums/enums';

@Component({
    selector: 'app-contribuitions-details',
    imports: [DialogModule, FormsModule, DropdownModule, ButtonModule, ToastModule, ProgressSpinnerModule, CommonModule, FileUploadModule, AutoCompleteModule],
    templateUrl: './contribuitions-details.component.html',
    styleUrl: './contribuitions-details.component.scss'
})
export class ContribuitionsDetailsComponent {
    constructor(
        private readonly messageService: MessageService,
        private readonly eventService: EventService,
        private readonly cabecService: CabecService
    ) {}

    ngOnInit(): void {
        this.populateEvents();
    }

    @Input() contrib: CabecContrib = {} as CabecContrib;
    @Input() visible: boolean = false;
    @Input() submitted: boolean = false;
    isLoading = false;

    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() save = new EventEmitter<void>();
    

    showEvents: boolean = false;

    eventStatusOptions = Object.entries(ContribStatus).map(([key, value]) => ({
        name: value,
        value: key
    }));
    cabectStatus: ContribStatus | null = null;

    contribTypeOptions = Object.entries(ContribType).map(([key, value]) => ({
        name: value,
        value: key
    }));
    cabecType: ContribType | null = null;

    filteredEvents: EventModel[] = [];
    events: EventModel[] = [];

    getFullName(event: EventModel): string {
        return `${event.code} ${event.title}`;
    }

    filterEvent(event: any) {
        const query = event.query.toLowerCase();
        this.filteredEvents = this.events
            .filter((event) => this.getFullName(event).toLowerCase().includes(query))
            .map((user) => ({
                ...user,
                fullName: this.getFullName(user)
            }));
    }

    populateEvents() {
        this.eventService.getAllEvents().subscribe(
            (response: Partial<ApiResponse<EventModel[]>>) => {
                // Permite que 'ok' seja opcional
                if (response?.data) {
                    this.events = response.data;
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

    onSave(contrib: CabecContrib) {
        this.isLoading = true;
        contrib.cabecStatus = 'PENDING';

        console.log('Saving contribution:', JSON.stringify(contrib));

        const saveObservable = contrib.id ? this.cabecService.update(contrib.id, contrib) : this.cabecService.create(contrib);

        saveObservable.subscribe({
            next: (response: any) => {
                const savedContrib = response.data;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Contribuição salva com sucesso.'
                });
                this.isLoading = false;
                this.save.emit(); // ✅ apenas notifica o pai
                this.hideDialog(); // fecha o modal
            },
            error: (err) => {
                this.isLoading = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: err?.error?.message || 'Falha ao salvar o contribuição.'
                });
            }
        });
    }
}
