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

    console.log(headers)

    const url = `http://localhost:8080/api/auth/change-password?isFirstTime=${isFirstTime}`;
    return this.http.post(url, request, { headers });
  }


  // =========== ESQUECI A SENHA ===========

  // 1. Enviar código de confirmação
  sendConfirmationCode(email: string): Observable<any> {
    // Exemplo: POST /api/auth/email/sendConfirmationCode?email=xxx
    return this.http.post(`http://localhost:8080/api/auth/email/sendConfirmationCode?email=${email}`, {});
  }

  // 2. Validar o código
  validateConfirmationCode(email: string, code: string): Observable<any> {
    // Exemplo: POST /api/auth/email/validateConfirmationCode?email=xxx&code=yyy
    return this.http.post(`http://localhost:8080/api/auth/email/validateConfirmationCode?email=${email}&code=${code}`, {});
  }

  // 3. Definir nova senha
  setNewPassword(email: string, code: string, body: { newPassword: string; confirmPassword: string }): Observable<any> {
    // Exemplo: POST /api/auth/forgot-password/set-password?email=xxx&code=yyy
    return this.http.post(
      `http://localhost:8080/api/auth/forgot-password/set-password?email=${email}&code=${code}`,
      body
    );
  }
}
