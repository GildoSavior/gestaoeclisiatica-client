import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserUtil } from '../user/userUtils';
import { Consultation } from '../../models/consultation.model';
import { ApiResponse } from '../../dto/reponses';

@Injectable({
    providedIn: 'root'
})
export class ConsultationService {
    private readonly baseUrl = 'http://localhost:8080/api/consultations';

    constructor(private readonly http: HttpClient) {}

    private getHeaders(): HttpHeaders {
        const token = UserUtil.getUserData()?.jwtToken;
        return new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        });
    }

    getAll(): Observable<ApiResponse<Consultation[]>> {
        return this.http.get<ApiResponse<Consultation[]>>(this.baseUrl, { headers: this.getHeaders() });
    }

    getConsultationCode(code: string): Observable<ApiResponse<Consultation>> {
        return this.http.get<ApiResponse<Consultation>>(`${this.baseUrl}/${code}`, { headers: this.getHeaders() });
    }

    createConsultation(consultation: Consultation): Observable<ApiResponse<Consultation>> {
        return this.http.post<ApiResponse<Consultation>>(this.baseUrl, consultation, { headers: this.getHeaders() });
    }

    updateConsultation(code: string, consultation: Consultation): Observable<ApiResponse<Consultation>> {
        return this.http.put<ApiResponse<Consultation>>(`${this.baseUrl}/${code}`, consultation, { headers: this.getHeaders() });
    }

    deleteConsultation(code: string): Observable<ApiResponse<string>> {
        return this.http.delete<ApiResponse<string>>(`${this.baseUrl}/${code}`, { headers: this.getHeaders() });
    }
}
