// src/app/services/user.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly user = signal<{ name: string } | null>(null);

  setUser(name: string) {
    this.user.set({ name });
    localStorage.setItem('name', name);
    localStorage.setItem('token', Math.random().toString(36).substring(2, 15));
  }

  loadUserFromStorage() {
    const name = localStorage.getItem('name');
    if (name) this.user.set({ name });
  }

  clearUser() {
    this.user.set(null);
    localStorage.removeItem('name');
    localStorage.removeItem('token');
  }
}
