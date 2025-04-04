import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { AccessLevel, MaritalStatus } from '../../../../../models/enums/enums';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { UserService } from '../../../../../service/user/user.service';
import { User } from '../../../../../models/user.model';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { DepartmentService } from '../../../../../service/department/department.service';
import { Position } from '../../../../../models/position.model';
import { PositionService } from '../../../../../service/position/position.service';
import { ApiResponse } from '../../../../../dto/reponses';
import { Department } from '../../../../../models/departament.model';

@Component({
    selector: 'app-user-details-modal-component',
    imports: [DialogModule, FormsModule, DropdownModule, ButtonModule, ToastModule, ProgressSpinnerModule, CommonModule],
    templateUrl: './user-details-modal-component.html',
    styleUrl: './user-details-modal-component.scss'
})
export class UserDetailsModalComponent implements OnInit {
    constructor(
        private readonly userService: UserService,
        private readonly departmentService: DepartmentService,
        private readonly positionService: PositionService,
        private readonly messageService: MessageService
    ) {}

    dropdownYears: { name: string; value: string }[] = [];
    dropdownYear: { name: string; value: string } | null = null;

    dropdownDepartments: { name: string; value: string }[] = [];
    dropdownDepartment: { name: string; value: string } | null = null;

    dropdownPositions: { name: string; value: string }[] = [];
    dropdownPosition: { name: string; value: string } | null = null;

    selectedImage: string | ArrayBuffer | File | null = null;

    maritalStatusOptions = Object.entries(MaritalStatus).map(([key, value]) => ({
        name: value, // Exibe a descrição no dropdown
        value: key // Mantém o valor real para envio
    }));
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

    isLoading = false;

    ngOnInit(): void {
        this.populateYears();
        this.populateDepartments();
        this.populatePositions();
    }

    getAuthenticatedUser() {
        this.userService.getUserByEmail().subscribe(
            (response: { message: string; data: User }) => {
                if (response?.data) {
                    console.log('Utilizador autenticado:', JSON.stringify(response.data, null, 2));
                    this.user = response.data;
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

    populatePositions() {

        this.dropdownPositions = [];
        this.positionService.getAll().subscribe(
            (response: Partial<ApiResponse<Position[]>>) => {
                // Permite que 'ok' seja opcional
                if (response?.data) {
                    this.dropdownPositions = response.data.map((position) => ({
                        name: position.description,
                        value: position.code
                    }));
                } else {
                    alert('A resposta da API não contém cargos.');
                }
            },

            (error: any) => {
                alert('Erro ao buscar cargos:' + error);
            }
        );
    }

    populateDepartments() {
        this.dropdownDepartments = [];
        
        this.departmentService.getAll().subscribe(
            (response: Partial<ApiResponse<Department[]>>) => {
                // Permite que 'ok' seja opcional
                if (response?.data) {
                    this.dropdownDepartments = response.data.map((department) => ({
                        name: department.description,
                        value: department.code
                    }));
                } else {
                    alert('A resposta da API não contém departamentos.');
                }
            },

            (error: any) => {
                console.error('Erro ao buscar departamentos:', error);
            }
        );
    }

    triggerFileInput() {
        this.fileInput.nativeElement.click();
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files?.[0]) {
            this.selectedImage = input.files[0]; // Armazena diretamente como File
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
        this.isLoading = true;

        const saveObservable = user.id ? this.userService.updateUser(user.email as string, user) : this.userService.createUser(user);

        saveObservable.subscribe({
            next: (response: { message: string; data: User }) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: response.message
                });

                // Se houver uma imagem, faz o upload
                if (this.selectedImage) {
                    this.uploadImage(user.email as string);
                } else {
                    this.hideDialog();
                    this.isLoading = false;
                }
            },
            error: (err: { error: { message: string } }) => {
                this.isLoading = false;
                this.showError('Falha ao salvar utilizador: ' + err.error.message);
            }
        });
    }

    uploadImage(email: string) {
        if (this.selectedImage instanceof File) {
            // Garante que é um File
            this.userService.uploadUserImage(email, this.selectedImage).subscribe({
                next: (response: { message: string; data: User }) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: response.message
                    });
                    this.isLoading = false;
                    this.hideDialog();
                },
                error: (err: { error: { message: string } }) => {
                    this.isLoading = false;
                    this.showError('Falha ao fazer upload da imagem: ' + err.error.message);
                }
            });
        } else {
            this.isLoading = false;
            this.showError('Erro: Nenhum arquivo válido selecionado.');
        }
    }
}
