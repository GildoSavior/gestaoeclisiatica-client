import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CabecContrib } from '../../models/cabec-contrib.model';
import { HttpResponse } from '../../dto/http-response.model'
import { UserUtil } from '../user/userUtils';

@Injectable({
  providedIn: 'root',
})
export class CabecService {
  private readonly apiUrl = 'http://localhost:8080/api/contrib';

  constructor(private readonly http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = UserUtil.getUserData()?.jwtToken;
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }

  getAll(): Observable<HttpResponse<CabecContrib[]>> {
    return this.http.get<HttpResponse<CabecContrib[]>>(this.apiUrl, { headers: this.getHeaders() });
  }

  getById(id: number): Observable<HttpResponse<CabecContrib>> {
    return this.http.get<HttpResponse<CabecContrib>>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getByEvent(eventId: number): Observable<HttpResponse<CabecContrib[]>> {
    return this.http.get<HttpResponse<CabecContrib[]>>(`${this.apiUrl}/event/${eventId}`, { headers: this.getHeaders() });
  }

  create(cabec: CabecContrib): Observable<HttpResponse<CabecContrib>> {
    return this.http.post<HttpResponse<CabecContrib>>(this.apiUrl, cabec, { headers: this.getHeaders() });
  }

  update(id: number, cabec: CabecContrib): Observable<HttpResponse<CabecContrib>> {
    return this.http.put<HttpResponse<CabecContrib>>(`${this.apiUrl}/${id}`, cabec, { headers: this.getHeaders() });
  }

  delete(id: number): Observable<HttpResponse<string>> {
    return this.http.delete<HttpResponse<string>>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
