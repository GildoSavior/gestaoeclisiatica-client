import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subscription } from 'rxjs';
import { LayoutService } from '../../../layout/service/layout.service';
import { EventService } from '../../../service/event.service';
import { EventModel } from '../../../models/event.model';
import { EventStatus, Enum_EventType } from '../../../models/enums/enums';

@Component({
    standalone: true,
    selector: 'app-event-status-widget',
    imports: [CommonModule, ChartModule, DropdownModule, FormsModule],
    template: `
    <div class="card !mb-8">
        <div class="font-semibold text-xl mb-4">Eventos por Estado</div>

        <div class="flex flex-col md:flex-row gap-4 mb-4">
            <p-dropdown
                [(ngModel)]="selectedStatus"
                [options]="statusOptions"
                placeholder="Estado"
                class="w-full md:w-1/2"
                (onChange)="updateChart()"
            ></p-dropdown>

            <p-dropdown
                [(ngModel)]="selectedType"
                [options]="typeOptions"
                placeholder="Tipo de Evento"
                class="w-full md:w-1/2"
                (onChange)="updateChart()"
            ></p-dropdown>
        </div>

        <p-chart type="bar" [data]="chartData" [options]="chartOptions" class="h-80" />
    </div>
    `,
    providers: [EventService]
})
export class EventStatusWidget {
    events: EventModel[] = [];
    chartData: any;
    chartOptions: any;
    subscription!: Subscription;

    selectedStatus: string | null = null;
    selectedType: string | null = null;

    statusOptions = [
        { label: 'Todos', value: null },
        { label: EventStatus.PENDING, value: 'PENDING' },
        { label: EventStatus.APPROVED, value: 'APPROVED' },
        { label: EventStatus.REJECTED, value: 'REJECTED' },
        { label: EventStatus.PROCESSED, value: 'PROCESSED' }
    ];

    typeOptions = [
        { label: 'Todos', value: null },
        { label: Enum_EventType.WEDDING, value: 'WEDDING' },
        { label: Enum_EventType.PROPOSAL, value: 'PROPOSAL' },
        { label: Enum_EventType.FUNERAL, value: 'FUNERAL' }
    ];

    constructor(private layoutService: LayoutService, private eventService: EventService) {}

    ngOnInit() {
        this.subscription = this.layoutService.configUpdate$
            .pipe(debounceTime(25))
            .subscribe(() => this.updateChart());

        this.eventService.getAllEvents().subscribe({
            next: (res) => {
                this.events = res.data ?? [];
                this.updateChart();
            },
            error: (err) => {
                console.error('Erro ao buscar eventos:', err);
            }
        });
    }

    updateChart() {
        const filtered = this.events.filter(ev => {
            return (!this.selectedStatus || ev.eventStatus === this.selectedStatus) &&
                   (!this.selectedType || ev.eventType === this.selectedType);
        });

        const grouped: Record<string, number> = {};
        filtered.forEach(ev => {
            const label = ev.eventType || 'Desconhecido';
            grouped[label] = (grouped[label] || 0) + 1;
        });

        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const borderColor = documentStyle.getPropertyValue('--surface-border');
        const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

        this.chartData = {
            labels: Object.keys(grouped),
            datasets: [{
                label: 'Nº de Eventos',
                data: Object.values(grouped),
                backgroundColor: documentStyle.getPropertyValue('--p-primary-300'),
                barThickness: 32
            }]
        };

        this.chartOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: { color: textColor }
                }
            },
            scales: {
                x: {
                    ticks: { color: textMutedColor },
                    grid: { color: 'transparent', borderColor: 'transparent' }
                },
                y: {
                    ticks: { color: textMutedColor },
                    grid: { color: borderColor, borderColor: 'transparent', drawTicks: false }
                }
            }
        };
    }

    ngOnDestroy() {
        this.subscription?.unsubscribe();
    }
}
