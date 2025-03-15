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
import { UserDetailsModalComponent } from './components/components/user-details-modal-component/user-details-modal-component.component';

import { User } from '../../models/user.model';
import { UserService } from '../../service/user/user.service';
import { DropdownModule } from 'primeng/dropdown';
import { emptyUser } from '../../service/user/userUtils';

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
        DropdownModule,
        UserDetailsModalComponent
    ],
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    providers: [MessageService, ConfirmationService]
})
export class UsersComponent implements OnInit {
    userDialog: boolean = false;
    users = signal<User[]>([]);
    user: User = { ...emptyUser };
    selectedUser!: User | null;
    submitted: boolean = false;
    statuses!: any[];
    @ViewChild('dt') dt!: Table;
    exportColumns!: ExportColumn[];
    cols!: Column[];

    constructor(
        private readonly userService: UserService,
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
        this.userService.getAllUsers().subscribe(
            (response: { message: string; data: User[] }) => {
                if (response && response.data) {
                    this.users.set(response.data);
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

    deleteUser(user: User) {
        if (!user?.email) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Aviso',
                detail: 'Email inválido',
                life: 3000
            });
            return;
        }
    
        this.confirmationService.confirm({
            message: `Tem certeza de que deseja eliminar o utilizador ${user.name}?`,
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.userService.deleteUserByEmail(user?.email as string).subscribe({
                    next: () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: 'Utilizador eliminado com sucesso',
                            life: 3000
                        });
    
                        // Resetando usuário selecionado
                        this.selectedUser = null;
                        this.user = emptyUser;
    
                        // Recarrega os dados após a exclusão
                        this.loadDemoData();
                    },
                    error: (error) => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro',
                            detail: `Erro ao eliminar utilizador: ${error.message}`,
                            life: 3000
                        });
                    }
                });
            }
        });
    }
    
    

    editUser(user: User) {
        this.user = { ...user };
        this.userDialog = true;
    }
}
