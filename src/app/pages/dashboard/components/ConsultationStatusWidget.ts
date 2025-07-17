import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { ChartModule } from 'primeng/chart';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subscription } from 'rxjs';
import { LayoutService } from '../../../layout/service/layout.service';
import { ConsultationService } from '../../../service/consultation/consultation.service';
import { ConsultationStatus } from '../../../models/enums/enums';

@Component({
  standalone: true,
  selector: 'app-consultation-status-widget',
  imports: [CommonModule, CardModule, DropdownModule, ChartModule, FormsModule],
  template: `
    <p-card class="!mb-8" header="Resumo de Consultas">
      <div class="flex justify-between mb-4">
        <div class="font-semibold text-lg">Status de Consultas</div>
        <p-dropdown
          [options]="statusOptions"
          [(ngModel)]="selectedStatus"
          placeholder="Todos"
          optionLabel="label"
          class="w-40"
          (onChange)="filterChart()"
        ></p-dropdown>
      </div>

      <p-chart type="doughnut" [data]="chartData" [options]="chartOptions" class="h-80" />
    </p-card>
  `,
  providers: [ConsultationService]
})
export class ConsultationStatusWidget {
  chartData: any;
  chartOptions: any;
  subscription!: Subscription;

  consultations: any[] = [];
  filteredConsultations: any[] = [];

  selectedStatus: string | null = null;
  statusOptions = [
    { label: 'Todos', value: null },
    { label: ConsultationStatus.PENDENTE, value: 'PENDENTE' },
    { label: ConsultationStatus.APROVADA, value: 'APROVADA' },
    { label: ConsultationStatus.REJEITADA, value: 'REJEITADA' },
    { label: ConsultationStatus.REALIZADA, value: 'REALIZADA' }
  ];

  constructor(
    private layoutService: LayoutService,
    private consultationService: ConsultationService
  ) {}

  ngOnInit(): void {
    this.subscription = this.layoutService.configUpdate$
      .pipe(debounceTime(25))
      .subscribe(() => this.buildChart());

    this.consultationService.getAll().subscribe({
      next: (res) => {
        this.consultations = res.data ?? [];
        this.filteredConsultations = [...this.consultations];
        this.buildChart();
      },
      error: (err) => console.error('Erro ao buscar consultas:', err)
    });
  }

  buildChart(): void {
    const counts: Record<string, number> = {
      PENDING: 0,
      APPROVED: 0,
      REJECTED: 0
    };

    this.filteredConsultations.forEach((c) => {
      const key = c.status;
      if (counts[key] !== undefined) {
        counts[key]++;
      }
    });

    this.chartData = {
      labels: [
        ConsultationStatus.PENDENTE,
        ConsultationStatus.APROVADA,
        ConsultationStatus.REJEITADA,
        ConsultationStatus.REALIZADA
      ],
      datasets: [
        {
          data: [counts['PENDENTE'], counts['APROVADA'], counts['REJEITADA']],
          backgroundColor: [
            'rgba(255, 193, 7, 0.8)',
            'rgba(40, 167, 69, 0.8)',
            'rgba(220, 53, 69, 0.8)'
          ],
          hoverBackgroundColor: [
            'rgba(255, 193, 7, 1)',
            'rgba(40, 167, 69, 1)',
            'rgba(220, 53, 69, 1)'
          ]
        }
      ]
    };

    const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
    this.chartOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      responsive: true,
      maintainAspectRatio: false
    };
  }

  filterChart(): void {
    this.filteredConsultations = this.selectedStatus
      ? this.consultations.filter(c => c.status === this.selectedStatus)
      : [...this.consultations];
    this.buildChart();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
