import { Injectable } from '@angular/core';
import { Department } from '../../models/departament.model';

@Injectable({
  providedIn: 'root' // Isso garante que o serviço seja injetável globalmente
})

export class DepartmentService {
    createDepartment(department: Department) {
        throw new Error('Method not implemented.');
    }
    updateDepartment(code: string) {
        throw new Error('Method not implemented.');
    }
    constructor() { }
}
