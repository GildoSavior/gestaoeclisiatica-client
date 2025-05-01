import { Component, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { OverlayPanelModule, OverlayPanel } from 'primeng/overlaypanel';
import { DialogModule } from 'primeng/dialog';
import { AppConfigurator } from '../app.configurator';
import { LayoutService } from '../../service/layout.service';
import { UserDetailsModalComponent } from '../../../pages/users/components/components/user-details-modal-component/user-details-modal-component.component';
import { emptyUser } from '../../../service/user/userUtils';
import { User } from '../../../models/user.model';
import { CarouselModule } from 'primeng/carousel';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

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
        UserDetailsModalComponent,
        CarouselModule,
        ButtonModule,
        CardModule
    ],
    templateUrl: './app-topbar.component.html'
})
export class AppTopbar {
    @ViewChild('profileMenu') profileMenu!: OverlayPanel;

    isProfileDialogVisible: boolean = false;
    currentUrl: string = '';
    user: User = {...emptyUser}

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
