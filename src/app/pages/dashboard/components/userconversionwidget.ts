import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subscription } from 'rxjs';
import { LayoutService } from '../../../layout/service/layout.service';
import { UserService } from '../../../service/user/user.service';
import { User } from '../../../models/user.model';
import { MaritalStatus, DisciplinaryStatus } from '../../../models/enums/enums';

@Component({
    standalone: true,
    selector: 'app-user-conversion-widget',
    imports: [CommonModule, ChartModule, DropdownModule, FormsModule],
    template: `
    <div class="card !mb-8">
        <div class="font-semibold text-xl mb-4">Distribuição de Utilizadores</div>

        <div class="flex flex-col md:flex-row gap-4 mb-4">
            <p-dropdown
                [(ngModel)]="selectedYear"
                [options]="yearOptions"
                placeholder="Ano de Conversão"
                class="w-full md:w-1/3"
                (onChange)="updateChart()"
            ></p-dropdown>

            <p-dropdown
                [(ngModel)]="selectedDisciplinary"
                [options]="disciplinaryOptions"
                placeholder="Estado Disciplinar"
                class="w-full md:w-1/3"
                (onChange)="updateChart()"
            ></p-dropdown>

            <p-dropdown
                [(ngModel)]="selectedMarital"
                [options]="maritalOptions"
                placeholder="Estado Civil"
                class="w-full md:w-1/3"
                (onChange)="updateChart()"
            ></p-dropdown>
        </div>

        <p-chart type="bar" [data]="chartData" [options]="chartOptions" class="h-80" />
    </div>
    `,
    providers: [UserService]
})
export class UserConversionWidget {
    users: User[] = [];
    chartData: any;
    chartOptions: any;

    subscription!: Subscription;

    selectedYear: number | null = null;
    selectedDisciplinary: string | null = null;
    selectedMarital: string | null = null;

    yearOptions: { label: string, value: number }[] = [];
    disciplinaryOptions = [
        { label: 'Todos', value: null },
        { label: DisciplinaryStatus.DISCIPLINED, value: 'DISCIPLINED' },
        { label: DisciplinaryStatus.UNDISCIPLINED, value: 'UNDISCIPLINED' }
    ];

    maritalOptions = [
        { label: 'Todos', value: null },
        { label: MaritalStatus.SINGLE, value: 'SINGLE' },
        { label: MaritalStatus.MARRIED, value: 'MARRIED' },
        { label: MaritalStatus.DIVORCED, value: 'DIVORCED' },
        { label: MaritalStatus.WIDOWED, value: 'WIDOWED' }
    ];

    constructor(private layoutService: LayoutService, private userService: UserService) {}

    ngOnInit() {
        this.subscription = this.layoutService.configUpdate$.pipe(debounceTime(25)).subscribe(() => {
            this.updateChart();
        });

        this.userService.getAllUsers().subscribe({
            next: (res) => {
                this.users = res.data ?? [];

                this.yearOptions = Array.from(
                    new Set(this.users.map(u => u.yearOfConversation).filter(Boolean))
                ).map(y => ({ label: String(y), value: y as number }));

                this.updateChart();
            },
            error: (err) => {
                console.error('Erro ao buscar usuários:', err);
            }
        });
    }

    updateChart() {
        const filtered = this.users.filter(user => {
            return (!this.selectedYear || user.yearOfConversation === this.selectedYear) &&
                   (!this.selectedDisciplinary || user.disciplinaryStatus === this.selectedDisciplinary) &&
                   (!this.selectedMarital || user.maritalStatus === this.selectedMarital);
        });

        const counts: Record<string, number> = {};
        filtered.forEach(user => {
            const label = `${user.yearOfConversation || 'Sem ano'}`;
            counts[label] = (counts[label] || 0) + 1;
        });

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const borderColor = documentStyle.getPropertyValue('--surface-border');
        const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

        this.chartData = {
            labels: Object.keys(counts),
            datasets: [{
                label: 'Nº de Utilizadores',
                backgroundColor: documentStyle.getPropertyValue('--p-primary-400'),
                data: Object.values(counts),
                barThickness: 32
            }]
        };

        this.chartOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: { labels: { color: textColor } }
            },
            scales: {
                x: {
                    ticks: { color: textMutedColor },
                    grid: { color: 'transparent', borderColor: 'transparent' }
                },
                y: {
                    ticks: { color: textMutedColor },
                    grid: {
                        color: borderColor,
                        borderColor: 'transparent',
                        drawTicks: false
                    }
                }
            }
        };
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
