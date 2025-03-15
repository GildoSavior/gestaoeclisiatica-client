import { MaritalStatus } from './../../models/enums/enums';
import { Component, ElementRef, OnInit, ViewChild, signal } from '@angular/core';
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

import { User } from '../../models/user.model';
import { UserService } from '../../service/user/user.service';
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
    selector: 'app-users',
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
        DropdownModule
    ],
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    providers: [MessageService, ConfirmationService]
})
export class UsersComponent implements OnInit {
    userDialog: boolean = false;
    users = signal<User[]>([]);
    user!: User;
    selectedUser!: User | null;
    submitted: boolean = false;
    statuses!: any[];
    @ViewChild('dt') dt!: Table;
    exportColumns!: ExportColumn[];
    cols!: Column[];
    maritalStatusOptions = Object.values(MaritalStatus).map((status) => ({ name: status, code: status }));
    maritalStatus: MaritalStatus | null = null;
    dropdownYears: { name: string; value: number }[] = [];
    dropdownYear: { name: string; value: number } | null = null;
    selectedImage: string | ArrayBuffer | null = null;

    @ViewChild('fileInput') fileInput!: ElementRef;

    constructor(
        private readonly eventService: UserService,
        private readonly messageService: MessageService,
        private readonly confirmationService: ConfirmationService
    ) {}

    exportCSV() {
        this.dt.exportCSV();
    }

    ngOnInit(): void {
        this.loadDemoData();
        this.populateYears();
    }

    loadDemoData() {
        this.eventService.getAllUsers().subscribe(
            (response: { message: string; data: User[] }) => {
                if (response && response.data) {
                    this.users.set(response.data);
                    console.log('utilizadore:  ', JSON.stringify(response.data, null, 2));
                } else {
                    console.warn('A resposta da API não contém usuários.');
                }
            },
            (error: any) => {
                console.error('Erro ao buscar usuários:', error);
            }
        );

        this.cols = [
            { field: '', header: 'Utilizador' },
            { field: 'email', header: 'Email' },
            { field: 'age', header: 'Idade' },
            { field: 'phoneNumber', header: 'Telefone' },
            { field: 'address', header: 'Morada' },
            { field: 'departament', header: 'Departamento' },
            { field: 'disciplinaryStatus', header: 'Estado Disciplinar' },
            { field: 'accessLevel', header: 'Nível de Acesso' },
            { field: 'maritalStatus', header: 'Marital' }
        ];

        this.exportColumns = this.cols.map((col) => ({ title: col.header, dataKey: col.field }));
    }

    populateYears() {
        const currentYear = new Date().getFullYear();
        const startYear = 1900; // Defina o ano inicial conforme necessário
        this.dropdownYears = [];

        for (let year = currentYear; year >= startYear; year--) {
            this.dropdownYears.push({ name: year.toString(), value: year });
        }
    }

    triggerFileInput() {
        this.fileInput.nativeElement.click();
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files?.[0]) {
            const file = input.files[0];
            const reader = new FileReader();

            reader.onload = (e) => {
                this.selectedImage = e.target?.result ?? null;
            };

            reader.readAsDataURL(file);
        }
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    openNew() {
        this.user = {} as User;
        this.submitted = false;
        this.userDialog = true;
    }

    hideDialog() {
        this.userDialog = false;
        this.submitted = false;
    }

    deleteSelectedUser() {
        if (!this.selectedUser?.email) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Aviso',
                detail: 'Nenhum utilizador selecionado para excluir.',
                life: 3000
            });
            return;
        }
    }

    saveUser(usr: User) {}

    deleteUser(user: User) {}

    editUser(user: User) {
        this.userDialog = true;
        this.user = { ...user };
    }

    MaritalStatus = [
        { name: 'Option 1', code: 'Option 1' },
        { name: 'Option 2', code: 'Option 2' },
        { name: 'Option 3', code: 'Option 3' }
    ];
}
