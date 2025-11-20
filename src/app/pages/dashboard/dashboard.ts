import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { TodoService } from '../../services/todo';
import { Todo } from '../../interfaces/Interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent {
  authService = inject(AuthService);
  todoService = inject(TodoService);
  fb = inject(FormBuilder);
  router = inject(Router);

  user = this.authService.currentUser;

  addForm = this.fb.group({
    todo: ['', Validators.required]
  });

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  addTodo() {
    if (this.addForm.valid) {
      this.todoService.addTodo(this.addForm.value.todo!);
      this.addForm.reset();
    }
  }

  // Navigate to routed detail page
  openTask(todo: Todo) {
    this.router.navigate(['/taskdetail', todo.id]);
  }

  // --- Drag and Drop Logic (HTML5 API) ---
  onDragStart(event: DragEvent, task: Todo) {
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', JSON.stringify(task));
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onDrop(event: DragEvent, targetStatus: boolean) {
    event.preventDefault();
    if (event.dataTransfer) {
      const data = event.dataTransfer.getData('text/plain');
      if (data) {
        const draggedTask: Todo = JSON.parse(data);
        if (draggedTask.completed !== targetStatus) {
          this.todoService.toggleStatus(draggedTask);
        }
      }
    }
  }
}
