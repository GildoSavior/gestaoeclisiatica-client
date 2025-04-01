import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { Consultation } from '../../../../../models/consultation.model';
import { ConsultationStatus } from '../../../../../models/enums/enums';
import { ConsultationService } from '../../../../../service/consultation/consultation.service';
import { ApiResponse } from '../../../../../dto/reponses';


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

    toLocalISOStringWithoutMs(date: Date): string {
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T` +
               `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }

    saveConsultation(consultation: Consultation) {
        this.isLoading = true;
    
        // Verifica se a data foi informada e é válida
        if (typeof consultation.data !== 'string' || !consultation.data.trim()) {
            this.showError('Data da consulta não informada.');
            this.isLoading = false;
            return;
        }
    
        const parsedDate = new Date(consultation.data);
        if (isNaN(parsedDate.getTime())) {
            this.showError('Data da consulta inválida.');
            this.isLoading = false;
            return;
        }
    
        // Converte a data para o formato aceito pelo Spring Boot (LocalDateTime sem milissegundos)
        consultation.data = this.toLocalISOStringWithoutMs(parsedDate);
    
        console.log('Consulta a ser enviada:', JSON.stringify(consultation));
    
        // const saveObservable = consultation.code != null
        //     ? this.consultationService.updateConsultation(consultation.code, consultation) 
        //     : this.consultationService.createConsultation(consultation);

            const saveObservable =  this.consultationService.createConsultation(consultation);
    
            saveObservable.subscribe({
                next: (response: ApiResponse<Consultation>) => {
                    if (response?.ok && response.data) { // Certifique-se de que 'ok' está sendo validado
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: response.message
                        });
                        this.hideDialog();
                    } else {
                        this.showError('Falha ao salvar consulta: ' + (response.message || 'Erro desconhecido'));
                        this.isLoading = false;
                        return
                    }
                    this.isLoading = false;
                },
                error: (err: { error?: { message: string } }) => {
                    this.isLoading = false;
                    const errorMessage = err?.error?.message || 'Erro desconhecido';
                    this.showError('Falha ao salvar consulta: ' + errorMessage);
                }
            });
        
    }
}
