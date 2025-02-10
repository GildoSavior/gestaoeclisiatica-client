import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventModel } from "../models/event.model";
import { HttpResponse } from '../models/http-response.model';




@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = 'http://localhost:8080/events'; // Altere para a URL do seu backend

  constructor(private http: HttpClient) {}

  // Obter todos os eventos
  getAllEvents(): Observable<HttpResponse<EventModel[]>> {
    return this.http.get<HttpResponse<EventModel[]>>(this.apiUrl);
  }

  // Obter eventos de um usuário específico
  getEventsByUser(userId: string): Observable<HttpResponse<EventModel[]>> {
    return this.http.get<HttpResponse<EventModel[]>>(`${this.apiUrl}/user/${userId}`);
  }

  // Criar um evento para um usuário
  createEvent(userId: string, event: EventModel): Observable<HttpResponse<EventModel>> {
    return this.http.post<HttpResponse<EventModel>>(`${this.apiUrl}/user/${userId}/`, event);
  }

  // Atualizar um evento
  updateEvent(eventCode: string, userId: string, event: EventModel): Observable<HttpResponse<EventModel>> {
    return this.http.put<HttpResponse<EventModel>>(`${this.apiUrl}/${eventCode}/user/${userId}/`, event);
  }

  // Deletar um evento pelo código
  deleteEvent(eventCode: string): Observable<HttpResponse<string>> {
    return this.http.delete<HttpResponse<string>>(`${this.apiUrl}/${eventCode}`);
  }

  // Deletar todos os eventos de um usuário
  deleteEventsByUser(userId: string): Observable<HttpResponse<string>> {
    return this.http.delete<HttpResponse<string>>(`${this.apiUrl}/user/${userId}`);
  }
}
