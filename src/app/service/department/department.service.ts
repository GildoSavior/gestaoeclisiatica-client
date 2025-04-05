import { Injectable } from '@angular/core';
import { Department } from '../../models/departament.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserUtil } from '../user/userUtils';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../dto/reponses';


@Injectable({
    providedIn: 'root'
})
export class DepartmentService {
    private readonly baseUrl = 'http://localhost:8080/api/departments';

    constructor(private readonly http: HttpClient) {}

    private getHeaders(): HttpHeaders {
        const token = UserUtil.getUserData()?.jwtToken;
        return new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        });
    }

    getAll(): Observable<ApiResponse<Department[]>> {
        return this.http.get<ApiResponse<Department[]>>(this.baseUrl, { headers: this.getHeaders() });
    }

    getDepartmentByCode(code: string): Observable<ApiResponse<Department>> {
        return this.http.get<ApiResponse<Department>>(`${this.baseUrl}/${code}`, { headers: this.getHeaders() });
    }

    createDepartment(department: Department): Observable<ApiResponse<Department>> {
        return this.http.post<ApiResponse<Department>>(this.baseUrl, department, { headers: this.getHeaders() });
    }

    updateDepartment(id: number, department: Department): Observable<ApiResponse<Department>> {
        return this.http.put<ApiResponse<Department>>(`${this.baseUrl}/${id}`, department, { headers: this.getHeaders() });
    }

    deleteDepartment(id: number): Observable<ApiResponse<Department>> {
        return this.http.delete<ApiResponse<Department>>(`${this.baseUrl}/${id}`, { headers: this.getHeaders() });
    }
}
