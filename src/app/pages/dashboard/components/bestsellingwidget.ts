import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { CabecService } from '../../../service/contrib/contrib.service';
import { CabecContrib } from '../../../models/cabec-contrib.model';

@Component({
    standalone: true,
    selector: 'app-best-selling-widget',
    imports: [CommonModule, ButtonModule, MenuModule],
    template: `
    <div class="card">
        <div class="flex justify-between items-center mb-6">
            <div class="font-semibold text-xl">Contribuições em Destaque</div>
            <div>
                <button pButton type="button" icon="pi pi-ellipsis-v" class="p-button-rounded p-button-text p-button-plain" (click)="menu.toggle($event)"></button>
                <p-menu #menu [popup]="true" [model]="items"></p-menu>
            </div>
        </div>
        <ul class="list-none p-0 m-0">
            <li *ngFor="let contrib of contributions" class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <span class="text-surface-900 dark:text-surface-0 font-medium mr-2 mb-1 md:mb-0">
                        {{ contrib.title }}
                    </span>
                    <div class="mt-1 text-muted-color">{{ contrib.type }}</div>
                </div>
                <div class="mt-2 md:mt-0 flex items-center">
                    <div class="bg-surface-300 dark:bg-surface-500 rounded-border overflow-hidden w-40 lg:w-24" style="height: 8px">
                        <div class="bg-primary h-full" [ngStyle]="{ width: getPercentage(contrib.totalApproved, contrib.total) + '%' }"></div>
                    </div>
                    <span class="text-primary ml-4 font-medium">
                        {{ getPercentage(contrib.totalApproved, contrib.total) }}%
                    </span>
                </div>
            </li>
        </ul>
    </div>`
})
export class BestSellingWidget {
    menu = null;
    items = [
        { label: 'Adicionar Novo', icon: 'pi pi-fw pi-plus' },
        { label: 'Remover', icon: 'pi pi-fw pi-trash' }
    ];

    contributions: CabecContrib[] = [];

    constructor(private cabecService: CabecService) {}

    ngOnInit(): void {
        this.cabecService.getAll().subscribe({
            next: (res) => {
                this.contributions = res.data ?? [];
            },
            error: (err) => {
                console.error('Erro ao buscar contribuições:', err);
            }
        });
    }

    getPercentage(approved: number, total: number): number {
        if (!total || total === 0) return 0;
        return Math.round((approved / total) * 100);
    }
}
