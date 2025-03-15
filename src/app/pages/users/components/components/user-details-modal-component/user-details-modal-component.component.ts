import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { AccessLevel, MaritalStatus } from '../../../../../models/enums/enums';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { UserService } from '../../../../../service/user/user.service';
import { User } from '../../../../../models/user.model';
import { emptyUser } from '../../../../../service/user/userUtils';

@Component({
    selector: 'app-user-details-modal-component',
    imports: [DialogModule, FormsModule, DropdownModule, ButtonModule],
    templateUrl: './user-details-modal-component.html',
    styleUrl: './user-details-modal-component.scss'
})
export class UserDetailsModalComponent {
    constructor(private readonly userService: UserService) {}

    dropdownYears: { name: string; value: number }[] = [];
    dropdownYear: { name: string; value: number } | null = null;
    selectedImage: string | ArrayBuffer | null = null;
    maritalStatusOptions = Object.values(MaritalStatus).map((status) => ({ name: status, code: status }));
    maritalStatus: MaritalStatus | null = null;
    accessOptions = Object.values(AccessLevel).map((status) => ({
        name: status,
        value: status // Alterado de "code" para "value"
    }));

    access: AccessLevel | null = null;
    @ViewChild('fileInput') fileInput!: ElementRef;
    @Input() visible: boolean = false; // Controla a visibilidade do modal
    @Input() user: any; // Recebe os dados do usuário

    ngOnInit(): void {
        console.log('Utilizador dialog: ', JSON.stringify(this.user));
        this.populateYears();
    }

    getAuthenticadeUser(): User {
        let user: User = emptyUser;
        this.userService.getUserByEmail().subscribe(
            (response: { message: string; data: User }) => {
                if (response?.data) {
                    console.log('Utilizador', JSON.stringify(response.data, null, 2));
                    user = response.data;
                } else {
                    console.warn('A resposta da API não contém usuários.');
                }
            },
            (error: any) => {
                console.error('Erro ao buscar usuários:', error);
            }
        );

        return user;
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
    hideDialog() {
        this.visible = false;
    }

    saveUser() {}

    close() {}
}
