import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserUtil } from '../user/userUtils';
import { Observable } from 'rxjs';
import { Position } from '../../models/position.model';

interface ApiResponse<T> {
    message: string;
    data: T;
}

@Injectable({
    providedIn: 'root'
})

export class PositionService {

  private readonly baseUrl = 'http://localhost:8080/api/positions';

    constructor(private readonly http: HttpClient) {}

    private getHeaders(): HttpHeaders {
        const token = UserUtil.getUserData()?.jwtToken;
        return new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        });
    }

    getAll(): Observable<ApiResponse<Position[]>> {
        return this.http.get<ApiResponse<Position[]>>(this.baseUrl, { headers: this.getHeaders() });
    }

    getPositionByCode(code: string): Observable<ApiResponse<Position>> {
        return this.http.get<ApiResponse<Position>>(`${this.baseUrl}/${code}`, { headers: this.getHeaders() });
    }

    createPosition(position: Position): Observable<ApiResponse<Position>> {
        return this.http.post<ApiResponse<Position>>(this.baseUrl, position, { headers: this.getHeaders() });
    }

    updatePosition(positionId: number, position: Position): Observable<ApiResponse<Position>> {
        return this.http.put<ApiResponse<Position>>(`${this.baseUrl}/${positionId}`, position, { headers: this.getHeaders() });
    }

    deletePosition(positionId: number): Observable<ApiResponse<Position>> {
        return this.http.delete<ApiResponse<Position>>(`${this.baseUrl}/${positionId}`, { headers: this.getHeaders() });
    }
}