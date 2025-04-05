import { Component, signal, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToolbarModule } from 'primeng/toolbar';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
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
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { Position } from '../../models/position.model';
import { PositionService } from '../../service/position/position.service';
import { PositionDetailsModalComponent } from './components/position-details-modal-component.component';
import { ApiResponse } from '../../dto/reponses';



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
  selector: 'app-positions',
  providers: [ConfirmationService],
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
        PositionDetailsModalComponent
  ],
  templateUrl: './positions.component.html',
  styleUrl: './positions.component.scss'
})

export class PositionsComponent {

 positionDialog: boolean = false;
    positions = signal<Position[]>([]);
    position: Position = { id: 0, code: '', description: '' };
    selectedPosition!: Position | null;
    submitted: boolean = false;
    statuses!: any[];
    @ViewChild('dt') dt!: Table;
    exportColumns!: ExportColumn[];
    cols!: Column[];

    constructor(
        private readonly positionService: PositionService,
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
        this.positionService.getAll().subscribe(
            (response: ApiResponse<Position[]>) => {
                if (response && response.data) {
                    this.positions.set(response.data);
                } else {
                    console.warn('A resposta da API não contém Cargos.');
                }
            },
            (error: any) => {
                console.error('Erro ao buscar Cargos:', error);
            }
        );

        this.cols = [
            { field: 'code', header: 'Codigo' },
            { field: 'description', header: 'Descrição' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.position = {} as Position;
        this.submitted = false;
        this.positionDialog = true;
    }

    closeModal() {
        this.positionDialog = false;
        this.submitted = false;
    }

    deleteSelectedPosition() {}

    savePosition(position: Position) {}

    deletePosition(position: Position) {

        this.confirmationService.confirm({
            message: `Tem certeza de que deseja eliminar o cargo ${position.code} - ${position.description}?`,
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.positionService.deletePosition(position.id).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'CArgo eliminado com sucesso',
                            life: 3000
                        });
                        
                        this.selectedPosition = null;
                        this.position = {} as Position;

                        this.loadDemoData();
                    },
                    error: (error) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro',
                            detail: `Erro ao eliminar cargo: ${error.message}`,
                            life: 3000
                        });
                    }
                });
            }
        });
    }
    
    editPosition(position: Position) {
        this.position = { ...position };
        this.positionDialog = true;
    }
}
