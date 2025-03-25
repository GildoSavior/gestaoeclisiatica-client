import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { PositionService } from '../../../service/position/position.service';
import { Position } from '../../../models/position.model';


@Component({
    selector: 'app-position-details-modal-component',
    standalone: true,
    imports: [DialogModule, FormsModule, DropdownModule, ButtonModule, ToastModule, ProgressSpinnerModule, CommonModule],
    templateUrl: './position-details-modal-component.html',
    styleUrl: './position-details-modal-component.scss'
})
export class PositionDetailsModalComponent implements OnInit {
    constructor(
        private readonly positionService: PositionService,
        private readonly messageService: MessageService
    ) {}

    @Input() visible: boolean = false;
    @Input() position: Position = {id: '', code: '', description:''}
    @Output() onClose = new EventEmitter<void>(); 
    isLoading = false;

    ngOnInit(): void {}

    hideDialog() {
        this.visible = false;
        this.onClose.emit(); 
    }

    private showError(message: string) {
        this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: message
        });
    }

    savePosition(position: Position) {
        this.isLoading = true;

        const saveObservable = position.id ? this.positionService.updatePosition(position.code, position) : this.positionService.createPosition(position);
        saveObservable.subscribe({
            next: (response: { message: string; data: Position }) => {
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
                this.showError('Falha ao salvar Cargo: ' + err.error.message);
            }
        });
    }
}
