import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from '../app.configurator';
import { LayoutService } from '../../service/layout.service';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator],
    templateUrl: './app-topbar.component.html'
})
export class AppTopbar {
    items!: MenuItem[];

    currentUrl: string = '';

    constructor(public layoutService: LayoutService, private router: Router) {
        this.router.events.subscribe(() => {
            this.currentUrl = this.router.url;
          });

    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
        console.log(this.currentUrl);
    }
    
}
