import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Table } from 'primeng/table';
import { TableModule } from 'primeng/table';
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
import { ConfirmationService, MessageService } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { Consultation } from '../../models/consultation.model';
import { ConsultationService } from '../../service/consultation/consultation.service';
import { ConsultationDetailsModalComponent } from './components/consultation-details-modal-component.component';
import {ApiResponse} from '../../dto/reponses';

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
    selector: 'app-consultations',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        TableModule,
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
        MultiSelectModule,
        InputTextModule,
        ButtonModule,
        SelectModule,
        FormsModule,
        TextareaModule,
        DropdownModule,
        ConsultationDetailsModalComponent
    ],
    templateUrl: './consultations.component.html',
    styleUrls: ['./consultations.component.scss'],
    providers: [MessageService, ConfirmationService]
})
export class ConsultationsComponent implements OnInit {
    consultationDialog: boolean = false;
    consultations = signal<Consultation[]>([]);
    consultation: Consultation = {} as Consultation
    selectedConsultation!: Consultation | null;
    submitted: boolean = false;
    statuses!: any[];
    @ViewChild('dt') dt!: Table;
    exportColumns!: ExportColumn[];
    cols!: Column[];

    constructor(
        private readonly consultationService: ConsultationService,
        private readonly messageService: MessageService,
        private readonly confirmationService: ConfirmationService
    ) {}

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit(): void {
        this.loadDemoData();
    }

    loadDemoData() {
        this.consultationService.getAll().subscribe(
            (response: { message: string; data: Consultation[] }) => {
                if (response && response.data) {
                    this.consultations.set(response.data);
                } else {
                    console.warn('A resposta da API não contém consultas.');
                }
            },
            (error: any) => {
                console.error('Erro ao buscar usuários:', error);
            }
        );

        this.cols = [
            { field: 'code', header: 'Codigo' },
            { field: 'title', header: 'Titulo' },
            { field: 'description', header: 'Descrição' },
            { field: 'userEmail', header: 'Utilizador' },
            { field: 'date', header: 'Data' },
            { field: 'status', header: 'Estado' },

        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.consultation = {} as Consultation;
        this.submitted = false;
        this.consultationDialog = true;
    }

    hideDialog() {
        this.consultationDialog = false;
        this.submitted = false;
    }

    deleteSelectedConsultation() {
        if (!this.selectedConsultation?.code) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Aviso',
                detail: 'Nenhum consulta selecionada para excluir.',
                life: 3000
            });
            return;
        }
    }

    saveConsultation(consultation: Consultation) {}

    deleteConsultation(consultation: Consultation) {
      
        this.confirmationService.confirm({
            message: `Tem certeza de que deseja eliminar a consulta ${consultation.code}?`,
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                // this.isLoading = true;?
    
                this.consultationService.deleteConsultation(consultation.id).subscribe({
                    next: (response: ApiResponse<string>) => {
    
                        if (response?.ok) {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Sucesso',
                                detail: response.message || 'Consulta eliminada com sucesso',
                                life: 3000
                            });
    
                            this.selectedConsultation = null;
                            this.consultation = {} as Consultation;
    
                            this.loadDemoData();
                        } else {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Erro',
                                detail: response.message || 'Erro ao eliminar consulta',
                                life: 3000
                            });
                        }
                    },
                    error: (error: { error?: { message?: string } }) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro',
                            detail: `Erro ao eliminar consulta: ${error?.error?.message || 'Erro desconhecido'}`,
                            life: 3000
                        });
                    }
                });
            }
        });
    }
    
    
    

    editConsultation(consultation: Consultation) {
        this.consultation = { ...consultation };
        this.consultationDialog = true;
    }
}
