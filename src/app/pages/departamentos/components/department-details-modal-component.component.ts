import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { DepartmentService } from '../../../service/department/department.service';
import { Department } from '../../../models/departament.model';

@Component({
    selector: 'app-department-details-modal-component',
    standalone: true,
    imports: [DialogModule, FormsModule, DropdownModule, ButtonModule, ToastModule, ProgressSpinnerModule, CommonModule],
    templateUrl: './department-details-modal-component.html',
    styleUrl: './department-details-modal-component.scss'
})
export class DepartmentDetailsModalComponent implements OnInit {
    constructor(
        private readonly departmentService: DepartmentService,
        private readonly messageService: MessageService
    ) {}

    @Input() visible: boolean = false;
    @Input() department!: any
    @Output() onClose = new EventEmitter<void>(); // Evento para notificar o fechamento do modal

    isLoading = false;

    ngOnInit(): void {}

    hideDialog() {
        this.visible = false;
        this.onClose.emit(); // Emite o evento ao fechar o modal
    }

    private showError(message: string) {
        this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: message
        });
    }

    saveDepartment(department: Department) {
        this.isLoading = true;

        const saveObservable = department.id
            ? this.departmentService.updateDepartment(department.code)
            : this.departmentService.createDepartment(department);
    }
}
