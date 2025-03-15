import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
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
export class UserDetailsModalComponent implements OnInit {
    constructor(private readonly userService: UserService) {}

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

    saveUser(user: User) {  
        console.log(JSON.stringify(user, null, 2))

        if (!user.id) {
            this.userService.createUser(user).subscribe(
                (response: { message: string; data: User }) => {
                    if (response?.data) {
                        alert(response.message);
                    } else {
                        console.warn('A resposta da API não contém usuários.');
                    }
                },
                (error: any) => {
                    console.error('Erro ao criar utilizador:', error);
                }
            );

            return;
        }


        console.log(user.id);
    }

    close() {
        this.visible = false;
    }
}
