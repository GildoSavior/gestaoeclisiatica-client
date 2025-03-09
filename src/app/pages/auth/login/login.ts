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
import { CommonModule } from '@angular/common';

import { AccessLevel } from '../../../models/enums/enums';
import { AuthService } from '../../../service/auth/auth.service';
import { AuthResponse } from '../../../dto/reponses';
import { UserUtil } from '../../../service/user/user.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, ButtonModule, CheckboxModule, InputTextModule, PasswordModule, RippleModule, DialogModule, ToastModule, AppFloatingConfigurator],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [MessageService, ConfirmationService]
})
export class Login {
    email = '';
    password = '';
    checked = false;

    // Controla a exibição do modal "Esqueci a senha"
    showForgotPasswordDialog = false;

    // Etapa atual do fluxo de "Esqueci a senha"
    // Pode ser: 'email' | 'code' | 'newPassword'
    forgotPasswordStep: 'email' | 'code' | 'newPassword' = 'email';

    // Dados do fluxo "Esqueci a senha"
    forgotPasswordData = {
        email: '',
        code: '',
        newPassword: '',
        confirmPassword: ''
    };

    // Controla a exibição do modal de "Alterar senha no primeiro login"
    showChangePasswordDialog: boolean = false;

    // Dados para alterar senha no primeiro login
    changePasswordRequest = {
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
                const accessLevel = userData?.accessLevel;
                const isFirstLogin = userData?.isFirstLogin;

                if (isFirstLogin) {
                    // Abre o modal para alterar a senha (primeiro login)
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

    // Abre o modal de alteração de senha (primeiro login)
    openChangePasswordDialog() {
        this.changePasswordRequest.oldPassword = '';
        this.changePasswordRequest.newPassword = '';
        this.changePasswordRequest.confirmPassword = '';
        this.showChangePasswordDialog = true;
    }

    // Fecha o modal de alteração de senha (primeiro login)
    closeChangePasswordDialog() {
        this.showChangePasswordDialog = false;
    }

    // Chama o endpoint /change-password passando isFirstTime=true
    confirmChangePassword() {
        this.authService.changePassword(this.changePasswordRequest, true).subscribe({
            next: () => {
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
                this.router.navigate(accessLevel !== AccessLevel.ROLE_USER ? ['/admin/dashboard'] : ['/client']);
            },
            error: (err: { error: { message: string } }) => {
                this.showError('Falha ao atualizar a palavra-passe: ' + err.error.message);
            }
        });
    }

    // ====================== ESQUECI A SENHA ======================

    // Abre o modal "Esqueci a senha" e inicia no step 'email'
    openForgotPasswordDialog() {
        this.forgotPasswordData = {
            email: '',
            code: '',
            newPassword: '',
            confirmPassword: ''
        };
        this.forgotPasswordStep = 'email';
        this.showForgotPasswordDialog = true;
    }

    // Fecha o modal "Esqueci a senha"
    closeForgotPasswordDialog() {
        this.showForgotPasswordDialog = false;
    }

    // 1. Enviar código de confirmação
    sendConfirmationCode() {
        const userEmail = this.forgotPasswordData.email;
        if (!userEmail) {
            this.showError('Informe o seu email.');
            return;
        }

        // Exemplo: POST /api/auth/email/sendConfirmationCode?email=xxx
        this.authService.sendConfirmationCode(userEmail).subscribe({
            next: (response) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Código de confirmação enviado para o seu email.'
                });
                // Avança para a etapa de validar o código
                this.forgotPasswordStep = 'code';
            },
            error: (err) => {
                this.showError('Falha ao enviar código de confirmação: ' + err.error?.message);
            }
        });
    }

    // 2. Validar o código de confirmação
    validateConfirmationCode() {
        const { email, code } = this.forgotPasswordData;
        if (!code) {
            this.showError('Informe o código de confirmação.');
            return;
        }

        // Exemplo: POST /api/auth/email/validateConfirmationCode?email=xxx&code=yyy
        this.authService.validateConfirmationCode(email, code).subscribe({
            next: (response) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Código validado com sucesso. Defina sua nova senha.'
                });
                // Avança para a etapa de definir nova senha
                this.forgotPasswordStep = 'newPassword';
            },
            error: (err) => {
                this.showError('Falha ao validar código: ' + err.error?.message);
            }
        });
    }

    // 3. Definir nova senha
    setNewPassword() {
        const { email, code, newPassword, confirmPassword } = this.forgotPasswordData;
        if (!newPassword || !confirmPassword) {
            this.showError('Preencha os campos de nova senha.');
            return;
        }

    
        this.authService.setNewPassword(email, code, { newPassword, confirmPassword }).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Senha redefinida com sucesso! Faça login novamente.'
                });
                // Fecha o modal e limpa dados
                this.closeForgotPasswordDialog();
            },
            error: (err) => {
                this.showError('Falha ao redefinir senha: ' + err.error?.message);
            }
        });
    }
}
