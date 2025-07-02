import { Component, signal, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
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
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { EventService } from '../../service/event.service';
import { EventModel } from '../../models/event.model';
import { HttpResponse } from '../../dto/http-response.model';
import { EventStatus } from '../../models/enums/enums';
import { EventDetailsComponent } from './components/event-details/event-details.component';
import { ModeUtil } from '../../mode.utils';
import { Router } from '@angular/router';
import { UserUtil } from '../../service/user/userUtils';

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
    selector: 'app-events',
    standalone: true,
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
        EventDetailsComponent
    ],
    templateUrl: './events.component.html',
    styleUrl: './events.component.scss',
    providers: [MessageService, EventService, ConfirmationService]
})
export class EventsComponent {
    mode: 'admin' | 'client' = 'client';
    eventDialog: boolean = false;
    events = signal<EventModel[]>([]);
    event!: EventModel;
    selectedEvent!: EventModel | null;
    submitted: boolean = false;
    statuses!: any[];
    exportColumns!: ExportColumn[];
    cols!: Column[];

    @ViewChild('dt') dt!: Table;

    constructor(
        private readonly eventService: EventService,
        private readonly messageService: MessageService,
        private readonly confirmationService: ConfirmationService,
        private router: Router
    ) {}

    ngOnInit() {
        this.mode = ModeUtil.getCurrentMode(this.router.url);
        this.loadDemoData();
    }

    loadDemoData() {
        const userData = UserUtil.getUserData();
        const email = userData?.email;

        if (this.mode === 'admin') {
            this.eventService.getAllEvents().subscribe(
                (response: HttpResponse<EventModel[]>) => this.events.set(response.data),
                (error) => console.error('Erro ao buscar eventos:', error)
            );
        } else if (this.mode === 'client' && email) {
            this.eventService.getEventsByUser(email).subscribe(
                (response: HttpResponse<EventModel[]>) => this.events.set(response.data),
                (error) => console.error('Erro ao buscar eventos:', error)
            );
        }

        this.statuses = [
            { label: 'PENDENTE', value: 'PENDING' },
            { label: 'REJEITADO', value: 'REJECTED' },
            { label: 'APROVADO', value: 'APPROVED' }
        ];

        this.cols = [
            { field: 'code', header: 'Codigo', customExportHeader: 'Event Code' },
            { field: 'eventType', header: 'Tipo de Evento' },
            { field: 'title', header: 'Titulo' },
            ...(this.mode === 'admin' ? [{ field: 'name', header: 'Utilizador' }] : []),
            { field: 'description', header: 'Descrição' },
            { field: 'initialDate', header: 'Data inicial' },
            { field: 'finalDate', header: 'Data final' },
            { field: 'eventStatus', header: 'Estado' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    exportCSV() {
        this.dt.exportCSV();
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.event = {
            id: null,
            code: '',
            name: '',
            eventType: '',
            userEmail: '',
            title: '',
            description: '',
            initialDate: '',
            finalDate: '',
            eventStatus: '',
            needContribution: false,
            imagesUrls: []
        };
        this.submitted = false;
        this.eventDialog = true;
    }

    getSeverity(status: string) {
        switch (status) {
            case 'APPROVED':
                return 'success';
            case 'PENDING':
                return 'warn';
            case 'REJECTED':
                return 'danger';
            default:
                return 'info';
        }
    }

    deleteSelectedEvent() {
        const event = this.selectedEvent;

        const eventId = event?.id;
        if (!event || !event.code || typeof eventId !== 'number') {
            this.messageService.add({
                severity: 'warn',
                summary: 'Aviso',
                detail: 'Nenhum evento válido selecionado para excluir.',
                life: 3000
            });
            return;
        }

        this.confirmationService.confirm({
            key: 'deleteConfirm',
            message: `Tem a certeza que pretende eliminar este evento ${event.code}?`,
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.eventService.deleteEvent(eventId).subscribe({
                    next: () => {
                        this.selectedEvent = null;
                        this.loadDemoData();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Evento eliminado com sucesso',
                            life: 3000
                        });
                    },
                    error: (error) => {
                        console.error('Erro ao eliminar evento:', error);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro',
                            detail: 'Erro ao eliminar evento',
                            life: 3000
                        });
                    }
                });
            }
        });
    }

    deleteEvent(event: EventModel) {
        const eventId = event.id;

        if (!event.code || typeof eventId !== 'number') {
            this.messageService.add({
                severity: 'warn',
                summary: 'Aviso',
                detail: 'Evento inválido ou ID ausente.',
                life: 3000
            });
            return;
        }

        this.confirmationService.confirm({
            key: 'deleteConfirm',
            message: `Tem a certeza que pretende eliminar o evento ${event.code}?`,
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.eventService.deleteEvent(eventId).subscribe({
                    next: () => {
                        this.selectedEvent = null;
                        this.loadDemoData();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Evento eliminado com sucesso',
                            life: 3000
                        });
                    },
                    error: (error) => {
                        console.error('Erro ao eliminar evento:', error);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro',
                            detail: 'Erro ao eliminar o evento.',
                            life: 3000
                        });
                    }
                });
            }
        });
    }

    editEvent(event: EventModel) {
        this.event = { ...event };
        this.eventDialog = true;
    }

    hideDialog() {
        this.eventDialog = false;
        this.submitted = false;
    }

    saveEvent() {
        this.eventDialog = false;
        this.submitted = false;
        this.loadDemoData();
    }
}
