import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast'; 
import { MessageService } from 'primeng/api'; // ✅ Importação necessária

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, ToastModule], // ✅ Importa o ToastModule corretamente
    providers: [MessageService], // ✅ Garante que o serviço de mensagens esteja disponível
    template: `
        <p-toast></p-toast> 
        <router-outlet></router-outlet>`
})
export class AppComponent {}
