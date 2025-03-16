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
        const userData = UserUtil.getUserData();

        const headers = new HttpHeaders({
            Authorization: `Bearer ${userData?.jwtToken}`
        });

        return this.http.get<{ message: string; data: User }>(`${this.baseUrl}/users/email/${userData?.email}`, { headers });
    }

    createUser(user: User): Observable<{ message: string; data: User }> {
        const userData = UserUtil.getUserData();

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userData?.jwtToken}`
        });

        console.log('Token JWT:', userData?.jwtToken);

        console.log(JSON.stringify(user, null, 2));
        return this.http.post<{ message: string; data: User }>(`${this.baseUrl}/users`, user, { headers });
    }

    updateUser(email: string, user: User): Observable<{ message: string; data: User }> {
        const userData = UserUtil.getUserData();

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userData?.jwtToken}`
        });

        return this.http.put<{ message: string; data: User }>(`${this.baseUrl}/users/${email}`, user, { headers });
    }

    deleteUserByEmail(email: string): Observable<{ message: string; data: any }> {
        const userData = UserUtil.getUserData();

        const headers = new HttpHeaders({
            Authorization: `Bearer ${userData?.jwtToken}`
        });

        return this.http.delete<{ message: string; data: User }>(`${this.baseUrl}/users/email/${email}`, { headers });
    }

    uploadUserImage(email: string, file: File): Observable<{ message: string; data: any }> {
      const userData = UserUtil.getUserData();
  
      const headers = new HttpHeaders({
          Authorization: `Bearer ${userData?.jwtToken}`
      });
  
      const formData = new FormData();
      formData.append('file', file);
  
      return this.http.post<{ message: string; data: any }>(
          `${this.baseUrl}/upload/${email}`,
          formData,
          { headers }
      );
  }
  
}
