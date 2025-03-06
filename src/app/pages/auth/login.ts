import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, AppFloatingConfigurator],
    templateUrl: "./login.component.html",
    providers:[MessageService, ConfirmationService, AuthService]
})
export class Login {
    email: string = '';
    password: string = '';
    checked: boolean = false;

    constructor(private authService: AuthService, private router: Router) {}

    onLogin() {
        this.authService.login(this.email, this.password).subscribe({
          next: (response) => {
            this.authService.saveUserData(response);
            this.router.navigate(['/dashboard']); // Redireciona após login bem-sucedido
          },
          error: (err) => {
            console.error('Erro no login:', err);
            alert('Login falhou. Verifique suas credenciais.');
          }
        });
      }
}
