import { Component } from '@angular/core';

@Component({
    selector: 'app-profile',
    template: `
        <div class="p-4">
            <h3>Perfil do Usuário</h3>
            <p>Nome: João da Silva</p>
            <p>Email: joaoemail.com</p>
            <p>Telefone: (11) 99999-9999</p>
        </div>
    `
})
export class ProfileComponent {}
