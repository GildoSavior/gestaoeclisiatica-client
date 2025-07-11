import { Component, signal, ViewChild } from '@angular/core';
import { Department } from '../../models/departament.model';
import { Table, TableModule } from 'primeng/table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DepartmentService } from '../../service/department/department.service';
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
import { DepartmentDetailsModalComponent } from './components/department-details-modal-component.component';
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
        DepartmentDetailsModalComponent
    ],
    templateUrl: './departamentos.component.html',
})
export class DepartamentosComponent {
    departmentDialog: boolean = false;
    departments = signal<Department[]>([]);
    department: Department = { id: 0, code: '', description: '' };
    selectedDepartment!: Department | null;
    submitted: boolean = false;
    statuses!: any[];
    @ViewChild('dt') dt!: Table;
    exportColumns!: ExportColumn[];
    cols!: Column[];

    constructor(
        private readonly departmentService: DepartmentService,
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
        this.departmentService.getAll().subscribe(
            (response:  ApiResponse<Department[]>) => {
                if (response && response.data) {
                    this.departments.set(response.data);
                } else {
                    console.warn('A resposta da API não contém Departamentos.');
                }
            },
            (error: any) => {
                console.error('Erro ao buscar Departamentos:', error);
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
  this.department = { id: 0, code: '', description: '' };
  this.submitted = false;
  this.departmentDialog = true;
}

    hideDialog() {
        this.departmentDialog = false;
        this.submitted = false;
    }

    closeModal() {
    this.departmentDialog = false;
    this.department = { id: 0, code: '', description: '' };
    this.selectedDepartment = null;
}


    deleteSelectedDepartment() {}

    saveDepartment(departament: Department) {}

    deleteDepartment(departament: Department) {

        this.confirmationService.confirm({
            message: `Tem certeza de que deseja eliminar o departamento ${departament.code} - ${departament.description}?`,
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.departmentService.deleteDepartment(departament?.id as number).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Departamento eliminado com sucesso',
                            life: 3000
                        });

                        // Resetando usuário selecionado
                        this.selectedDepartment = null;
                        this.department = {} as Department;

                        // Recarrega os dados após a exclusão
                        this.loadDemoData();
                    },
                    error: (error) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro',
                            detail: `Erro ao eliminar departamento: ${error.message}`,
                            life: 3000
                        });
                    }
                });
            }
        });
    }
editDepartment(department: Department) {
  this.department = { ...department }; // faz uma cópia
  this.submitted = false;
  this.departmentDialog = true;
}

}

