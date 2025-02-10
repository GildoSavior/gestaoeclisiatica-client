import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Event } from "../models/event.model";
import { HttpResponse } from '../models/http-response.model';




@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = 'http://localhost:8080/events'; // Altere para a URL do seu backend

  constructor(private http: HttpClient) {}

  // Obter todos os eventos
  getAllEvents(): Observable<HttpResponse<Event[]>> {
    return this.http.get<HttpResponse<Event[]>>(this.apiUrl);
  }

  // Obter eventos de um usuário específico
  getEventsByUser(userId: string): Observable<HttpResponse<Event[]>> {
    return this.http.get<HttpResponse<Event[]>>(`${this.apiUrl}/user/${userId}`);
  }

  // Criar um evento para um usuário
  createEvent(userId: string, event: Event): Observable<HttpResponse<Event>> {
    return this.http.post<HttpResponse<Event>>(`${this.apiUrl}/user/${userId}/`, event);
  }

  // Atualizar um evento
  updateEvent(eventCode: string, userId: string, event: Event): Observable<HttpResponse<Event>> {
    return this.http.put<HttpResponse<Event>>(`${this.apiUrl}/${eventCode}/user/${userId}/`, event);
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
