import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // <-- Importa Router
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { AccessLevel } from '../../models/enums/enums';
import { UserUtil } from '../../service/user/userUtils';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul>`
})
export class AppMenu {
    model: MenuItem[] = [];

    constructor(private router: Router) {} // <-- Injeta Router

    ngOnInit() {
        const currentUrl = this.router.url;
        console.log('Current URL:', currentUrl);

        if (currentUrl.startsWith('/admin')) {
            // Admin Dashboard
            this.model = [
                {
                    label: 'Home',
                    items: [
                        {
                            label: 'Dashboard',
                            icon: 'pi pi-fw pi-home',
                            routerLink: ['/admin']
                        }
                    ]
                },
                {
                    label: 'Pages',
                    icon: 'pi pi-fw pi-briefcase',
                    items: [
                        { label: 'Eventos', icon: 'pi pi-fw pi-calendar', routerLink: ['/admin/pages/events'] },
                        { label: 'Utilizadores', icon: 'pi pi-fw pi-users', routerLink: ['/admin/pages/users'] },
                        { label: 'Departamentos', icon: 'pi pi-fw pi-sitemap', routerLink: ['/admin/pages/departments'] },
                        { label: 'Cargos', icon: 'pi pi-fw pi-briefcase', routerLink: ['/admin/pages/positions'] },
                        { label: 'Consultas', icon: 'pi pi-calendar', routerLink: ['/admin/pages/consultations'] },
                        { label: 'Notícias', icon: 'pi pi-fw pi-book', routerLink: ['/admin/pages/news'] },
                        { label: 'Contribuições', icon: 'pi pi-credit-card', routerLink: ['/admin/pages/contribuicoes'] },
                        { label: 'Relatórios', icon: 'pi pi-fw pi-chart-line', routerLink: ['/admin/pages/reports'] }
                    ]
                }
            ];
        } else if (currentUrl.startsWith('/client')) {
            // Client
            this.model = [
                {
                    label: 'Home',
                    items: [
                        {
                            label: 'Home',
                            icon: 'pi pi-fw pi-home',
                            routerLink: ['/client']
                        }
                    ]
                },
                {
                    label: 'Páginas',
                    icon: 'pi pi-fw pi-briefcase',
                    items: [
                        {
                            label: 'Eventos',
                            icon: 'pi pi-fw pi-calendar',
                            items: [
                                {
                                    label: 'Meus Eventos',
                                    icon: 'pi pi-calendar-plus',
                                    routerLink: ['/client/pages/events']
                                }
                            ]
                        },
                        { label: 'Notícias', icon: 'pi pi-fw pi-book', routerLink: ['/client/pages/news'] }
                    ]
                }
            ];
        }
    }
}
