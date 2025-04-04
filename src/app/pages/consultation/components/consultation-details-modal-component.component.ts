import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { Consultation } from '../../../models/consultation.model';
import { ConsultationStatus } from '../../../models/enums/enums';
import { ConsultationService } from '../../../service/consultation/consultation.service';
import { ApiResponse } from '../../../dto/reponses';

@Component({
    selector: 'app-consultation-details-modal-component',
    imports: [DialogModule, FormsModule, DropdownModule, ButtonModule, ToastModule, ProgressSpinnerModule, CommonModule],
    templateUrl: './consultation-details-modal-component.html',
    styleUrl: './consultation-details-modal-component.scss'
})
export class ConsultationDetailsModalComponent implements OnInit {
    constructor(
        private readonly consultationService: ConsultationService,
        private readonly messageService: MessageService
    ) {}
    statusOptions = Object.entries(ConsultationStatus).map(([key, value]) => ({
        name: value, // Exibe a descrição no dropdown
        value: key // Mantém o valor real para envio
    }));

    @Input() visible: boolean = false;
    @Input() consultation!: any;
    @Output() onClose = new EventEmitter<void>();

    isLoading = false;

    ngOnInit(): void {}

    hideDialog() {
        this.visible = false;
    }

    private showError(message: string) {
        this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: message
        });
    }

    private showSuccess(message: string) {
        this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: message,
            life: 3000
        });
    }

    toLocalISOStringWithoutMs(date: Date): string {
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T` + `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }

    saveConsultation(consultation: Consultation) {
        this.isLoading = true;

        if (!this.isValidDate(consultation.date)) {
            this.showError('Data da consulta não informada ou inválida.');
            this.isLoading = false;
            return;
        }

        consultation.date = this.toLocalISOStringWithoutMs(new Date(consultation.date));

        const saveObservable = consultation.id != null ? this.consultationService.updateConsultation(consultation.id, consultation) : this.consultationService.createConsultation(consultation);

        saveObservable.subscribe({
            next: (response: ApiResponse<Consultation>) => {
                console.log('API Response:', response);
                if (response?.ok && response.data) {
                    this.showSuccess(response.message);
                    this.hideDialog();
                } else {
                    this.showError(response?.message || 'Erro desconhecido');
                }
            },
            error: (err: { error?: { message: string } }) => {
                const errorMessage = err?.error?.message || 'Erro desconhecido';
                this.showError('Falha ao salvar consulta: ' + errorMessage);
            },
            complete: () => {
                this.isLoading = false;
            }
        });
    }

    private isValidDate(date: string | undefined): boolean {
        if (typeof date !== 'string' || !date.trim()) return false;
        const parsed = new Date(date);
        return !isNaN(parsed.getTime());
    }
}
