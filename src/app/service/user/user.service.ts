import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { UserUtil } from './userUtils';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private readonly baseUrl = 'http://localhost:8080/api';

    constructor(private readonly http: HttpClient) {}

    getAllUsers(): Observable<{ message: string; data: User[] }> {
        const token = UserUtil.getUserData()?.jwtToken;
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http.get<{ message: string; data: User[] }>(`${this.baseUrl}/users`, { headers });
    }
    
    getUserByEmail(): Observable<{ message: string; data: User }> {
      const userData = UserUtil.getUserData()

      const headers = new HttpHeaders({
        Authorization: `Bearer ${userData?.jwtToken}`
      })

      return this.http.get<{message: string, data: User}>(`${this.baseUrl}/users/email/${userData?.email}`, { headers })
    }
}

