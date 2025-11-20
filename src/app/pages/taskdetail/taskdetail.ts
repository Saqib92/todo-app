import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Todo } from '../../interfaces/Interface';
import { TodoService } from '../../services/todo';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './taskdetail.html',
  styleUrl: './taskdetail.scss'
})
export class TaskDetail {

  todo!: Todo;                 
  todoService = inject(TodoService);
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);

  isEditing = false;
  form!: FormGroup;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    const found = this.todoService.todos().find(t => t.id === id);

    if (!found) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.todo = found;
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      todo: [this.todo.todo, Validators.required],
      completed: [this.todo.completed]
    });
  }

  enableEdit() {
    this.initForm();
    this.isEditing = true;
  }

  cancelEdit() {
    this.isEditing = false;
  }

  async saveEdit() {
    if (this.form.valid) {
      await this.todoService.updateTodo(this.todo.id, this.form.value);
      this.isEditing = false;
      this.router.navigate(['/dashboard']);
    }
  }

  async deleteTask() {
    if (confirm('Are you sure you want to delete this task?')) {
      await this.todoService.deleteTodo(this.todo.id);
      this.router.navigate(['/dashboard']);
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
