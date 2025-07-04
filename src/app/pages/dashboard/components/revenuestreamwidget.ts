import { Component } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { debounceTime, Subscription } from 'rxjs';
import { LayoutService } from '../../../layout/service/layout.service';
import { CabecService } from '../../../service/contrib/contrib.service';
import { ContribStatus, ContribType } from '../../../models/enums/enums';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-revenue-stream-widget',
    imports: [CommonModule, ChartModule],
    template: `
    <div class="card !mb-8">
        <div class="font-semibold text-xl mb-4">Contribuições por Tipo e Estado</div>
        <p-chart type="bar" [data]="chartData" [options]="chartOptions" class="h-80" />
    </div>`,
    providers: [CabecService]
})
export class RevenueStreamWidget {
    chartData: any;
    chartOptions: any;
    subscription!: Subscription;

    // Mapeamentos legíveis
    statusLabels: Record<string, string> = {
        PENDING: ContribStatus.PENDING,
        APPROVED: ContribStatus.APPROVED,
        REJECTED: ContribStatus.REJECTED,
        PROCESSED: ContribStatus.PROCESSED
    };

    typeLabels: Record<string, string> = {
        WEDDING: ContribType.WEDDING,
        FUNERAL: ContribType.FUNERAL,
        TRIP: ContribType.TRIP
    };

    constructor(
        private layoutService: LayoutService,
        private cabecService: CabecService
    ) {}

    ngOnInit() {
        this.subscription = this.layoutService.configUpdate$.pipe(debounceTime(25)).subscribe(() => {
            this.initChart();
        });

        this.initChart();
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const borderColor = documentStyle.getPropertyValue('--surface-border');
        const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

        this.cabecService.getAll().subscribe({
            next: (res) => {
                const data = res.data ?? [];

                // Inicializa a estrutura: tipo -> estado -> contagem
                const grouped: Record<string, Record<string, number>> = {};

                for (const item of data) {
                    const typeKey = item.type ?? 'OUTRO';
                    const statusKey = item.cabecStatus ?? 'INDEFINIDO';

                    if (!grouped[typeKey]) grouped[typeKey] = {};
                    grouped[typeKey][statusKey] = (grouped[typeKey][statusKey] || 0) + 1;
                }

                const types = Object.keys(grouped); // WEDDING, FUNERAL, etc.

                const datasets = Object.keys(this.statusLabels).map((statusKey, idx) => ({
                    label: this.statusLabels[statusKey],
                    backgroundColor: documentStyle.getPropertyValue(`--p-primary-${(idx + 2) * 100}`), // para cores diferentes
                    data: types.map(typeKey => grouped[typeKey]?.[statusKey] || 0),
                    barThickness: 32
                }));

                this.chartData = {
                    labels: types.map(typeKey => this.typeLabels[typeKey] || typeKey),
                    datasets
                };

                this.chartOptions = {
                    maintainAspectRatio: false,
                    aspectRatio: 0.8,
                    plugins: {
                        legend: {
                            labels: {
                                color: textColor
                            }
                        }
                    },
                    scales: {
                        x: {
                            stacked: true,
                            ticks: {
                                color: textMutedColor
                            },
                            grid: {
                                color: 'transparent',
                                borderColor: 'transparent'
                            }
                        },
                        y: {
                            stacked: true,
                            ticks: {
                                color: textMutedColor
                            },
                            grid: {
                                color: borderColor,
                                borderColor: 'transparent',
                                drawTicks: false
                            }
                        }
                    }
                };
            },
            error: (err) => {
                console.error('Erro ao carregar contribuições:', err);
            }
        });
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
