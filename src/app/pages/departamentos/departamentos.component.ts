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
  ],
  templateUrl: './departamentos.component.html',
  styleUrl: './departamentos.component.scss'
})

export class DepartamentosComponent {

 departmentDialog: boolean = false;
    departments = signal<Department[]>([]);
    department: Department = { id: '', code: '', description: '' };
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
        // this.departmentService.getAll().subscribe(
        //     (response: { message: string; data: Department[] }) => {
        //         if (response && response.data) {
        //             this.departments.set(response.data);
        //         } else {
        //             console.warn('A resposta da API não contém departamentos.');
        //         }
        //     },
        //     (error: any) => {
        //         console.error('Erro ao buscar departamentos:', error);
        //     }
        // );

        this.cols = [
            { field: 'code', header: 'Codigo' },
            { field: 'description', header: 'Descrição' },
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.department = {} as Department;
        this.submitted = false;
        this.departmentDialog = true;
    }

    hideDialog() {
        this.departmentDialog = false;
        this.submitted = false;
    }

    deleteSelectedDepartment() {}

    saveDepartment(departament: Department) {}

    deleteDepartment(departament: Department) {}
    
    editDepartment(departament: Department) {
        this.department = { ...departament };
        this.departmentDialog = true;
    }
}
