import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { AccessLevel, MaritalStatus } from '../../../../../models/enums/enums';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { UserService } from '../../../../../service/user/user.service';
import { User } from '../../../../../models/user.model';
import { emptyUser } from '../../../../../service/user/userUtils';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-user-details-modal-component',
    imports: [DialogModule, FormsModule, DropdownModule, ButtonModule, ToastModule],
    templateUrl: './user-details-modal-component.html',
    styleUrl: './user-details-modal-component.scss'
})
export class UserDetailsModalComponent implements OnInit {
    constructor(
        private readonly userService: UserService,
        private readonly messageService: MessageService
    ) {}

    dropdownYears: { name: string; value: string }[] = [];
    dropdownYear: { name: string; value: string } | null = null;
    selectedImage: string | ArrayBuffer | null = null;

    maritalStatusOptions = Object.values(MaritalStatus).map((status) => ({ name: status, value: status }));
    maritalStatus: MaritalStatus | null = null;

    accessOptions = Object.values(AccessLevel).map((access) => ({
        name: access,
        value: access
    }));
    access: AccessLevel | null = null;

    private _visible: boolean = false;
    @ViewChild('fileInput') fileInput!: ElementRef;
    //@Input() visible: boolean = false;
    @Input() isAdmin: boolean = false; // Controla a visibilidade do modal
    @Input() user: any; // Recebe os dados do usuário

    @Input()
    set visible(value: boolean) {
        this._visible = value;
        if (this._visible && !this.isAdmin) {
            this.getAuthenticatedUser();
        }
    }

    get visible(): boolean {
        return this._visible;
    }

    ngOnInit(): void {
        this.populateYears();
    }

    getAuthenticatedUser() {
        this.userService.getUserByEmail().subscribe(
            (response: { message: string; data: User }) => {
                if (response?.data) {
                    console.log('Utilizador autenticado:', JSON.stringify(response.data, null, 2));
                    this.user = response.data; // Atribui o usuário autenticado a this.user
                } else {
                    console.warn('A resposta da API não contém usuário.');
                }
            },

            (error: any) => {
                console.error('Erro ao buscar usuário:', error);
            }
        );
    }

    populateYears() {
        const currentYear = new Date().getFullYear();
        const startYear = 1900; // Defina o ano inicial conforme necessário
        this.dropdownYears = [];

        for (let year = currentYear; year >= startYear; year--) {
            this.dropdownYears.push({ name: year.toString(), value: year.toString() });
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

    hideDialog() {
        this.visible = false;
    }

    private showError(message: string) {
        this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: message
        });
    }

    saveUser(user: User) {
        if (!user.id) {
            this.userService.createUser(user).subscribe({
                next: (response: { message: string; data: User }) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: response.message
                    });
                    this.close();
                },
                error: (err: { error: { message: string } }) => {
                    this.showError('Falha ao atualizar utilizador: ' + err.error.message);
                }
            });

            return;
        }

        this.userService.updateUser(user.email as string, user).subscribe({
            next: (response: { message: string; data: User }) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: response.message
                });
                this.close();
            },
            error: (err: { error: { message: string } }) => {
                this.showError('Falha ao atualizar utilizador: ' + err.error.message);
            }
        });
    }

    close() {
        this.visible = false;
    }
}
