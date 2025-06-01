import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LineContrib } from '../../models/line-contrib.model';
import { HttpResponse } from '../../dto/http-response.model';
import { UserUtil } from '../user/userUtils';

@Injectable({
  providedIn: 'root',
})
export class LineService {
  private readonly apiUrl = 'http://localhost:8080/api/lines';

  constructor(private readonly http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = UserUtil.getUserData()?.jwtToken;
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  createLine(line: LineContrib): Observable<HttpResponse<LineContrib>> {
    return this.http.post<HttpResponse<LineContrib>>(this.apiUrl, line, {
      headers: this.getHeaders(),
    });
  }

  updateLine(lineId: number, line: LineContrib): Observable<HttpResponse<LineContrib>> {
    return this.http.put<HttpResponse<LineContrib>>(`${this.apiUrl}/${lineId}`, line, {
      headers: this.getHeaders(),
    });
  }

  deleteLine(lineId: number): Observable<HttpResponse<string>> {
    return this.http.delete<HttpResponse<string>>(`${this.apiUrl}/${lineId}`, {
      headers: this.getHeaders(),
    });
  }

  getAllLines(): Observable<HttpResponse<LineContrib[]>> {
    return this.http.get<HttpResponse<LineContrib[]>>(this.apiUrl, {
      headers: this.getHeaders(),
    });
  }

  getLinesByAuthenticatedUser(): Observable<HttpResponse<LineContrib[]>> {
    return this.http.get<HttpResponse<LineContrib[]>>(`${this.apiUrl}/me`, {
      headers: this.getHeaders(),
    });
  }

  updateStatus(lineId: number, status: string): Observable<HttpResponse<LineContrib>> {
    return this.http.put<HttpResponse<LineContrib>>(`${this.apiUrl}/${lineId}/status?status=${status}`, {}, {
      headers: this.getHeaders(),
    });
  }

  uploadLineImage(lineId: number, formData: FormData): Observable<HttpResponse<LineContrib>> {
    return this.http.post<HttpResponse<LineContrib>>(`${this.apiUrl}/${lineId}/upload`, formData, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${UserUtil.getUserData()?.jwtToken}`
      })
    });
  }
}
