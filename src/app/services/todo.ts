import { HttpClient } from '@angular/common/http';
import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { AuthService } from './auth';
import { Todo } from '../interfaces/Interface';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  // State Signals
  private rawTodos = signal<Todo[]>([]);

  // Computed State
  todos = computed(() => this.rawTodos().filter(t => !t.isDeleted));

  incompleteTodos = computed(() =>
    this.todos().filter(t => !t.completed).sort((a, b) => b.id - a.id)
  );

  completedTodos = computed(() =>
    this.todos().filter(t => t.completed).sort((a, b) => b.id - a.id)
  );

  isLoading = signal<boolean>(false);

  constructor() {
    // Auto-fetch when user logs in
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        this.fetchTodos(user.id);
      } else {
        this.rawTodos.set([]);
      }
    }, { allowSignalWrites: true });
  }

  async fetchTodos(userId: number) {
    this.isLoading.set(true);
    try {
      const res = await firstValueFrom(
        this.http.get<{ todos: Todo[] }>(`https://dummyjson.com/todos/user/${userId}`)
      );
      this.rawTodos.set(res.todos);
    } catch (err) {
      console.error('Fetch failed', err);
    } finally {
      this.isLoading.set(false);
    }
  }

  async toggleStatus(todo: Todo) {
    // Optimistic Update
    this.updateLocalTodo(todo.id, { completed: !todo.completed });

    try {
      await firstValueFrom(
        this.http.put(`https://dummyjson.com/todos/${todo.id}`, {
          completed: !todo.completed
        })
      );
    } catch (err) {
      // Revert on failure
      console.error('Update failed', err);
      this.updateLocalTodo(todo.id, { completed: todo.completed });
    }
  }

  async updateTodo(id: number, updates: Partial<Todo>) {
    // Optimistic Update
    const oldTodo = this.rawTodos().find(t => t.id === id);
    this.updateLocalTodo(id, updates);

    try {
      await firstValueFrom(
        this.http.put(`https://dummyjson.com/todos/${id}`, updates)
      );
    } catch (err) {
      if (oldTodo) this.updateLocalTodo(id, oldTodo);
    }
  }

  async addTodo(task: string) {
    const user = this.authService.currentUser();
    if (!user) return;

    // Optimistic ID (temp)
    const tempId = Date.now();
    const newTodo: Todo = {
      id: tempId,
      todo: task,
      completed: false,
      userId: user.id
    };

    this.rawTodos.update(current => [newTodo, ...current]);

    try {
      const added = await firstValueFrom(
        this.http.post<Todo>('https://dummyjson.com/todos/add', {
          todo: task,
          completed: false,
          userId: user.id
        })
      );
      // Replace temp ID with real ID
      this.rawTodos.update(current =>
        current.map(t => t.id === tempId ? { ...t, id: added.id } : t)
      );
    } catch (err) {
      console.error('Add failed', err);
      this.rawTodos.update(current => current.filter(t => t.id !== tempId));
    }
  }

  async deleteTodo(id: number) {
    // Optimistic
    const oldState = this.rawTodos();
    this.rawTodos.update(current => current.map(t => t.id === id ? { ...t, isDeleted: true } : t));

    try {
      await firstValueFrom(this.http.delete(`https://dummyjson.com/todos/${id}`));
      // Confirm delete (remove fully)
      this.rawTodos.update(current => current.filter(t => t.id !== id));
    } catch (err) {
      this.rawTodos.set(oldState);
    }
  }

  // Helper for optimistic updates
  private updateLocalTodo(id: number, updates: Partial<Todo>) {
    this.rawTodos.update(current =>
      current.map(t => t.id === id ? { ...t, ...updates } : t)
    );
  }
}
