import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';
import { UserUtil } from './userUtils';
import { ApiResponse } from '../../dto/reponses';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private readonly baseUrl = 'http://localhost:8080/api';

    constructor(private readonly http: HttpClient) {}

    getAllUsers(): Observable<ApiResponse<User[]>> {
        const token = UserUtil.getUserData()?.jwtToken;
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http.get<ApiResponse<User[]>>(`${this.baseUrl}/users`, { headers });
    }

    getUserByEmail(): Observable<ApiResponse<User>> {
        const userData = UserUtil.getUserData();

        const headers = new HttpHeaders({
            Authorization: `Bearer ${userData?.jwtToken}`
        });

        return this.http.get<ApiResponse<User>>(`${this.baseUrl}/users/email/${userData?.email}`, { headers });
    }

    createUser(user: User): Observable<ApiResponse<User>> {
        const userData = UserUtil.getUserData();

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userData?.jwtToken}`
        });

        console.log('Token JWT:', userData?.jwtToken);

        console.log(JSON.stringify(user, null, 2));
        return this.http.post<ApiResponse<User>>(`${this.baseUrl}/users`, user, { headers });
    }

    updateUser(email: string, user: User): Observable<ApiResponse<User>> {
        const userData = UserUtil.getUserData();

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userData?.jwtToken}`
        });

        return this.http.put<ApiResponse<User>>(`${this.baseUrl}/users/${email}`, user, { headers });
    }

    deleteUserByEmail(email: string): Observable<ApiResponse<string>> {
        const userData = UserUtil.getUserData();

        const headers = new HttpHeaders({
            Authorization: `Bearer ${userData?.jwtToken}`
        });

        return this.http.delete<ApiResponse<string>>(`${this.baseUrl}/users/email/${email}`, { headers });
    }

    uploadUserImage(email: string, file: File): Observable<ApiResponse<string>> {
        const userData = UserUtil.getUserData();

        const headers = new HttpHeaders({
            Authorization: `Bearer ${userData?.jwtToken}`
        });

        const formData = new FormData();
        formData.append('file', file);
        console.log(`${this.baseUrl}/users/upload/${email}`);
        return this.http.post<ApiResponse<string>>(`${this.baseUrl}/users/upload/${email}`, formData,   { headers } );
    }
}
