import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../service/user/user.service';
import { EventService } from '../../../service/event.service';
import { CabecService } from '../../../service/contrib/contrib.service';
import { ConsultationService } from '../../../service/consultation/consultation.service';

@Component({
    standalone: true,
    selector: 'app-stats-widget',
    imports: [CommonModule],
    providers: [UserService, EventService, CabecService, ConsultationService],
    template: `
        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Utilizadores</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ usersCount }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-blue-100 dark:bg-blue-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-users text-blue-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">+{{ newUsers }} </span>
                <span class="text-muted-color">este mês</span>
            </div>
        </div>

        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Eventos</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ eventsCount }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-calendar text-orange-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">+{{ newEvents }} </span>
                <span class="text-muted-color">este mês</span>
            </div>
        </div>

        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Contribuições</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ contribCount }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-wallet text-cyan-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">+{{ newContrib }} </span>
                <span class="text-muted-color">recentes</span>
            </div>
        </div>

        <div class="col-span-12 lg:col-span-6 xl:col-span-3">
            <div class="card mb-0">
                <div class="flex justify-between mb-4">
                    <div>
                        <span class="block text-muted-color font-medium mb-4">Consultas</span>
                        <div class="text-surface-900 dark:text-surface-0 font-medium text-xl">{{ consultCount }}</div>
                    </div>
                    <div class="flex items-center justify-center bg-purple-100 dark:bg-purple-400/10 rounded-border" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-comments text-purple-500 !text-xl"></i>
                    </div>
                </div>
                <span class="text-primary font-medium">+{{ newConsult }} </span>
                <span class="text-muted-color">marcadas</span>
            </div>
        </div>
    `
})
export class StatsWidget {
    usersCount = 0;
    newUsers = 0;
    eventsCount = 0;
    newEvents = 0;
    contribCount = 0;
    newContrib = 0;
    consultCount = 0;
    newConsult = 0;

    constructor(
        private userService: UserService,
        private eventService: EventService,
        private cabecService: CabecService,
        private consultationService: ConsultationService
    ) {}

    ngOnInit(): void {
        this.userService.getAllUsers().subscribe(res => {
            const users = res.data || [];
            this.usersCount = users.length;
            this.newUsers = users.filter(u => new Date(u.createdAt!).getMonth() === new Date().getMonth()).length;
        });

        this.eventService.getAllEvents().subscribe(res => {
            const events = res.data || [];
            this.eventsCount = events.length;
            this.newEvents = events.filter(e => new Date(e.initialDate).getMonth() === new Date().getMonth()).length;
        });

        this.cabecService.getAll().subscribe(res => {
            const contribs = res.data || [];
            this.contribCount = contribs.length;
            this.newContrib = contribs.filter(c => new Date(c.createdAt!).getMonth() === new Date().getMonth()).length;
        });

        this.consultationService.getAll().subscribe(res => {
            const consults = res.data || [];
            this.consultCount = consults.length;
            this.newConsult = consults.filter(c => new Date(c.createdAt!).getMonth() === new Date().getMonth()).length;
        });
    }
}
