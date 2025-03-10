import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    role = UserUtil.getUserData()?.accessLevel;
   
    ngOnInit() {
        console.log(this.role?.toString());

        this.model = [
            {
                label: 'Home',
                items: [
                    {
                        label: 'Home',
                        icon: 'pi pi-fw pi-home',
                        routerLink: this.role === AccessLevel.ROLE_USER ? ['/client'] : ['/admin/dashboard']
                    }
                ]
            },
            {
                label: 'Pages',
                icon: 'pi pi-fw pi-briefcase',
                routerLink: ['/pages'],
                items: [
                    {
                        label: 'Eventos',
                        icon: 'pi pi-fw pi-calendar', // Ícone correto para eventos
                        routerLink: ['/pages/events']
                    },

                    {
                        label: 'Utilizadores',
                        icon: 'pi pi-fw pi-users', // Ícone correto para eventos
                        routerLink: ['/pages/users']
                    }
                ],
               
              
            }
        ];
    }
}
