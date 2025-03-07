import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { ConfirmationService, MessageService } from 'primeng/api';

import { AccessLevel } from '../../../models/enums/enums';
import { AuthResponse } from '../../../models/reponses';
import { AuthService } from '../../../service/auth/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator],
    templateUrl: "./login.component.html",
    providers: [MessageService, ConfirmationService]
})
export class Login {
    email = '';
    password = '';
    checked = false;

    constructor(
        private authService: AuthService, 
        private router: Router, 
        private messageService: MessageService
    ) {}

    onLogin() {
        if (!this.email || !this.password) {
            this.showError('Preencha todos os campos!');
            return;
        }

        this.authService.login(this.email, this.password).subscribe({
            next: (response: AuthResponse) => {
                this.authService.saveUserData(response);

                const userDataString = localStorage.getItem('user');
                if (!userDataString) {
                    this.showError('Erro ao recuperar dados do usuário');
                    return;
                }

                const userData = JSON.parse(userDataString);
                const accessLevel = userData.accessLevel;

                // Redireciona com base no nível de acesso
                this.router.navigate([accessLevel !== AccessLevel.ROLE_USER ? 'admin/dashboard' : '/client']);
            },
            error: () => this.showError('Login falhou. Verifique suas credenciais.')
        });
    }

    private showError(message: string) {
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: message });
    }
}
