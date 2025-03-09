import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthResponse, ChangePasswordRequest } from '../../dto/reponses';




@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:8080/api/auth/login'; // Ajuste conforme necessário

  constructor(private readonly http: HttpClient) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.apiUrl, { email, password });
  }

  saveUserData(res: AuthResponse) {
    localStorage.setItem('user', JSON.stringify(res.data));
  }

  getUserData(): AuthResponse | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  logout() {
    localStorage.removeItem('user');
  }

  // Novo método
  changePassword(request: ChangePasswordRequest, isFirstTime: boolean): Observable<any> {
    const userDataString = localStorage.getItem('user');
    const userData = userDataString ? JSON.parse(userDataString) : null;
    const token = userData?.jwtToken || '';

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    const url = `http://localhost:8080/api/users/change-password?isFirstTime=${isFirstTime}`;
    return this.http.post(url, request, { headers });
  }
}
