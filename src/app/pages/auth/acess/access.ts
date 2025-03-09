import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { AccessLevel } from '../../../models/enums/enums';
import { UserUtil } from '../../../service/user/userUtils';


@Component({
    selector: 'app-access',
    standalone: true,
    imports: [ButtonModule, RouterModule, RippleModule, AppFloatingConfigurator],
    templateUrl: './access.component.html'
})
export class Access {
    buttonLabel: string = 'Go to Dashboard';
    buttonLink: string = '/admin/dashboard';
    userData: any;

    constructor() {
        this.userData = UserUtil.getUserData();

        if (this.userData && this.userData.accessLevel === AccessLevel.ROLE_USER) {
            this.buttonLabel = 'Go to Home';
            this.buttonLink = '/client';
        }
    }
}
