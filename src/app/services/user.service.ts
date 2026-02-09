import { Injectable, signal } from '@angular/core';

export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly user = signal<User | null>(null);

  setUser(name: string, email?: string, id?: number) {
    const user: User = {
      id: id || Date.now(),
      name,
      email: email || ''
    };
    this.user.set(user);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', Math.random().toString(36).substring(2, 15));
  }

  loadUserFromStorage() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.user.set(user);
      } catch {
        const name = localStorage.getItem('name');
        if (name) {
          this.setUser(name);
        }
      }
    } else {
      const name = localStorage.getItem('name');
      if (name) {
        this.setUser(name);
      }
    }
  }

  updateUser(updates: Partial<User>) {
    const currentUser = this.user();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      this.user.set(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return true;
    }
    return false;
  }

  updatePassword(currentPassword: string, newPassword: string): boolean {
    if (newPassword.length >= 6) {
      return true;
    }
    return false;
  }

  deleteAccount(): boolean {
    this.clearUser();
    return true;
  }

  clearUser() {
    this.user.set(null);
    localStorage.removeItem('user');
    localStorage.removeItem('name');
    localStorage.removeItem('token');
  }
}
