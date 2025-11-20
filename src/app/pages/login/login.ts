import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  router = inject(Router);

  loginForm = this.fb.group({
    username: ['emilys', Validators.required],
    password: ['emilyspass', Validators.required]
  });

  async onSubmit() {
    if (!this.loginForm.valid) return;

    const { username, password } = this.loginForm.value;

    const success = await this.authService.login(username!, password!);
    console.log(success);

    if (success) {
      // Navigate to dashboard
      this.router.navigate(['/dashboard']);
    } else {
      // Optionally show error
      alert(this.authService.error());
    }
  }
}