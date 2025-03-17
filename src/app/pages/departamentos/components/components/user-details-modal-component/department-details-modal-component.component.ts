import { Department } from './../../../../../models/departament.model';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { DepartmentService } from '../../../../../service/department/department.service';

@Component({
    selector: 'app-department-details-modal-component',
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
    @Input() isAdmin: boolean = false; // Controla a visibilidade do modal
    @Input() department: any; // Recebe os dados do usuário

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

    saveDepartment(department: Department) {
        this.isLoading = true;

        const saveObservable = department.id ? this.departmentService.updateDepartment(department.code) : this.departmentService.createDepartment(department);
    }
}
