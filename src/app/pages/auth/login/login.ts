import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { DialogModule } from 'primeng/dialog';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

import { AccessLevel } from '../../../models/enums/enums';
import { AuthService } from '../../../service/auth/auth.service';
import { AuthResponse, ChangePasswordRequest } from '../../../dto/reponses';
import { CommonModule } from '@angular/common';
import { UserUtil } from '../../../service/user/user.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator, ToastModule, DialogModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [MessageService, ConfirmationService]
})
export class Login {
    email = '';
    password = '';
    checked = false;

    // Controla a exibição do modal
    showChangePasswordDialog: boolean = false;

    // Armazena os dados do formulário de alteração de senha
    changePasswordRequest: ChangePasswordRequest = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    };

    constructor(
        private readonly authService: AuthService,
        private readonly router: Router,
        private readonly messageService: MessageService
    ) {}

    onLogin() {
        if (!this.email || !this.password) {
            this.showError('Preencha todos os campos!');
            return;
        }

        this.authService.login(this.email, this.password).subscribe({
            next: (response: AuthResponse) => {
                // Salva dados do usuário e token no localStorage
                this.authService.saveUserData(response);

                // Verifica se é o primeiro login
                const userData = UserUtil.getUserData();
                const accessLevel = userData?.accessLevel
                const isFirstLogin = userData?.isFirstLogin;

                if (isFirstLogin) {
                    // Abre o modal para alterar a senha
                    this.openChangePasswordDialog();
                } else {
                    // Redireciona de acordo com o nível de acesso
                    this.router.navigate(accessLevel !== AccessLevel.ROLE_USER ? ['/admin/dashboard'] : ['/client']);
                }
            },
            error: () => {
                this.showError('Login falhou. Verifique suas credenciais.');
            }
        });
    }

    // Exibe mensagem de erro usando p-toast
    private showError(message: string) {
        this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: message
        });
    }

    // Abre o modal de alteração de senha
    openChangePasswordDialog() {
        // Opcional: Se precisar da senha antiga, defina a oldPassword
        this.changePasswordRequest.oldPassword = '';
        this.changePasswordRequest.newPassword = '';
        this.changePasswordRequest.confirmPassword = '';
        this.showChangePasswordDialog = true;
    }

    // Fecha o modal
    closeChangePasswordDialog() {
        this.showChangePasswordDialog = false;
    }

    // Chama o endpoint /change-password passando isFirstTime=true
    confirmChangePassword() {
        this.authService.changePassword(this.changePasswordRequest, true).subscribe({
            next: (response) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Palavra-passe atualizada com sucesso!'
                });

                // Fecha o modal
                this.closeChangePasswordDialog();

                // Redireciona após a alteração
                const userData = UserUtil.getUserData();
                const accessLevel = userData?.accessLevel;
                this.router.navigate([accessLevel !== AccessLevel.ROLE_USER ? 'admin/dashboard' : '/client']);
            },
            error: (err: { error: { message: string } }) => {
                this.showError('Falha ao atualizar a palavra-passe: ' + err.error.message);
            }
        });
    }
}
