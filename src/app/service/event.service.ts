import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventModel } from "../models/event.model";
import { HttpResponse } from '../dto/http-response.model';
import { UserUtil } from './user/userUtils';


@Injectable({
  providedIn: 'root',
})
export class EventService {
  private readonly apiUrl = 'http://localhost:8080/api/events';

  constructor(private readonly http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = UserUtil.getUserData()?.jwtToken;
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });
  }

  getAllEvents(): Observable<HttpResponse<EventModel[]>> {
    return this.http.get<HttpResponse<EventModel[]>>(this.apiUrl, { headers: this.getHeaders() });
  }

  getEventsByUser(email: string): Observable<HttpResponse<EventModel[]>> {
    return this.http.get<HttpResponse<EventModel[]>>(`${this.apiUrl}/user/${email}`, { headers: this.getHeaders() });
  }

  createEvent(event: EventModel): Observable<HttpResponse<EventModel>> {
    return this.http.post<HttpResponse<EventModel>>(this.apiUrl, event, { headers: this.getHeaders() });
  }

  updateEvent(eventId: number, event: EventModel): Observable<HttpResponse<EventModel>> {
    return this.http.put<HttpResponse<EventModel>>(`${this.apiUrl}/${eventId}`, event, { headers: this.getHeaders() });
  }

  deleteEvent(eventId: number): Observable<HttpResponse<string>> {
    return this.http.delete<HttpResponse<string>>(`${this.apiUrl}/${eventId}`, { headers: this.getHeaders() });
  }

  deleteEventsByUser(userId: string): Observable<HttpResponse<string>> {
    return this.http.delete<HttpResponse<string>>(`${this.apiUrl}/user/${userId}`, { headers: this.getHeaders() });
  }

  uploadImages(eventId: number, formData: FormData): Observable<any> {
    // Nesse caso, não setamos Content-Type pois o Angular define automaticamente como multipart/form-data
    return this.http.post(`${this.apiUrl}/upload/${eventId}`, formData, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${UserUtil.getUserData()?.jwtToken}`
      })
    });
  }
}
