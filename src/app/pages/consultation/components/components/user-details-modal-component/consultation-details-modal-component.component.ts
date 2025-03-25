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

    saveConsultation(consultation: Consultation) {
        this.isLoading = true;
    
        // Converte a string '2025-03-18T08:47' para um objeto Date e depois para ISO string
        consultation.data = new Date(consultation.data).toISOString();
    
        console.log(JSON.stringify(consultation));
    
        const saveObservable = consultation.code 
            ? this.consultationService.updateConsultation(consultation.code, consultation) 
            : this.consultationService.createConsultation(consultation);
    
        saveObservable.subscribe({
            next: (response: { message: string; data: Consultation }) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: response.message
                });
                this.hideDialog();
                this.isLoading = false;
            },
            error: (err: { error: { message: string } }) => {
                this.isLoading = false;
                this.showError('Falha ao salvar consulta: ' + err.error.message);
            }
        });
    }
    
}
