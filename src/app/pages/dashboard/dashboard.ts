import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TodoService } from '../../services/todo';
import { AuthService } from '../../services/auth';
import { Todo } from '../../interfaces/Interface';

// CDK
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DragDropModule, CdkDrag],
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

  openTask(todo: Todo) {
    this.router.navigate(['/taskdetail', todo.id]);
  }

  // -----------------------------
  // CDK Drop Logic
  // -----------------------------
  drop(event: CdkDragDrop<Todo[]>, targetStatus: boolean) {
    if (event.previousContainer === event.container) {
      // Reorder inside same column
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Move between columns
      const task = event.previousContainer.data[event.previousIndex];
      this.todoService.toggleStatus(task); // update completed status

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
