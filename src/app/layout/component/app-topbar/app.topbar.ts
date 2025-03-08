import { Component, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { OverlayPanelModule, OverlayPanel } from 'primeng/overlaypanel';
import { DialogModule } from 'primeng/dialog';
import { AppConfigurator } from '../app.configurator';
import { LayoutService } from '../../service/layout.service';
import { ProfileComponent } from '../../../pages/user/profile.component';

@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [
        RouterModule,
        CommonModule,
        StyleClassModule,
        AppConfigurator,
        DialogModule,
        OverlayPanelModule, // ✅ Adicionado
        ProfileComponent
    ],
    templateUrl: './app-topbar.component.html'
})
export class AppTopbar {
    @ViewChild('profileMenu') profileMenu!: OverlayPanel;

    isProfileDialogVisible: boolean = false;
    currentUrl: string = '';

    constructor(public layoutService: LayoutService, private readonly router: Router) {
        this.router.events.subscribe(() => {
            this.currentUrl = this.router.url;
        });
    }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }

    logout() {
        localStorage.removeItem('user');
        this.router.navigate(['/auth/login']);
    }

    openProfileMenu(event: Event) {
        this.profileMenu.toggle(event);
    }

    openProfile() {
        this.isProfileDialogVisible = true;
    }
}
