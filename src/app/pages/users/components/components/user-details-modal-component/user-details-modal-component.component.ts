import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { AccessLevel, MaritalStatus, DisciplinaryStatus } from '../../../../../models/enums/enums';
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
import { InputSwitchModule } from 'primeng/inputswitch';

@Component({
    selector: 'app-user-details-modal-component',
    imports: [
        DialogModule,
        FormsModule,
        DropdownModule,
        ButtonModule,
        ToastModule,
        ProgressSpinnerModule,
        CommonModule,
        InputSwitchModule
    ],
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
    dropdownDepartments: { name: string; value: string }[] = [];
    dropdownPositions: { name: string; value: string }[] = [];
    selectedImage: string | ArrayBuffer | File | null = null;

    maritalStatusOptions = Object.entries(MaritalStatus).map(([key, value]) => ({ name: value, value: key }));
    accessOptions = Object.values(AccessLevel).map((access) => ({ name: access, value: access }));
    disciplinaryStatusOptions = Object.entries(DisciplinaryStatus).map(([key, value]) => ({ name: value, value: key }));

    private _visible: boolean = false;
    @ViewChild('fileInput') fileInput!: ElementRef;
    @Input() isAdmin: boolean = false;
    @Input() user: User = {} as User;

    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() save = new EventEmitter<void>();

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
            (response: ApiResponse<User>) => {
                if (response?.data) {
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
        const startYear = 1900;
        this.dropdownYears = [];
        for (let year = currentYear; year >= startYear; year--) {
            this.dropdownYears.push({ name: year.toString(), value: year.toString() });
        }
    }

    populatePositions() {
        this.dropdownPositions = [];
        this.positionService.getAll().subscribe(
            (response: Partial<ApiResponse<Position[]>>) => {
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
            this.selectedImage = input.files[0];
        }
    }

    hideDialog() {
        this.visible = false;
        this.visibleChange.emit(false);
    }

    private showError(message: string) {
        this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: message
        });
    }

    toLocalDateString(dateStr: string): string {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) throw new Error('Data inválida');
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    }

    saveUser(user: User) {
        this.isLoading = true;
        user.birthDay = this.toLocalDateString(user.birthDay as string);
        const saveObservable = user.id
            ? this.userService.updateUser(user.email as string, user)
            : this.userService.createUser(user);

        saveObservable.subscribe({
            next: (response: ApiResponse<User>) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: response.message
                });

                if (this.selectedImage instanceof File) {
                    this.uploadImage(user.email as string);
                } else {
                    this.save.emit();
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
            this.userService.uploadUserImage(email, this.selectedImage).subscribe({
                next: (response: ApiResponse<string>) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: response.message
                    });
                    this.save.emit();
                    this.hideDialog();
                    this.isLoading = false;
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
