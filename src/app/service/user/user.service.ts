import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' // Disponível globalmente na aplicação
})
export class UserService {
  
  getUserData(): any {
    const userDataString = localStorage.getItem('user');
    return userDataString ? JSON.parse(userDataString) : null;
  }
}
