import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { UserUtil } from './userUtils';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    
    const token = UserUtil.getUserData()?.jwtToken;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    var users = this.http.get<HttpResponse<User[]>>(`${this.baseUrl}/users`, { headers });
    return this.http.get<User[]>(`${this.baseUrl}/users`, { headers });
  }
}
