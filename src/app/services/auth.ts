import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { User } from '../interfaces/Interface';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  // Signals
  currentUser = signal<User | null>(this.loadUserFromStorage());
  isAuthenticated = computed(() => !!this.currentUser());
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor() {
    // Effect to sync user to local storage
    effect(() => {
      const user = this.currentUser();
      if (user) {
        localStorage.setItem('angular_todo_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('angular_todo_user');
      }
    });
  }

  private loadUserFromStorage(): User | null {
    const stored = localStorage.getItem('angular_todo_user');
    return stored ? JSON.parse(stored) : null;
  }

  async login(username: string, password: string): Promise<boolean> {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const user = await firstValueFrom(
        this.http.post<User>('https://dummyjson.com/auth/login', { username, password })
      );
      this.currentUser.set(user);
      return true;
    } catch (err: any) {
      console.error('Login failed', err);
      this.error.set(err.error?.message || 'Invalid credentials');
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }

  logout() {
    this.currentUser.set(null);
  }
}
