import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-plant-50 to-leaf-50 flex items-center justify-center py-12 px-4">
      <div class="card card-border shadow-xl max-w-md w-full">
        <!-- Header -->
        <div class="bg-gradient-to-r from-plant-600 to-leaf-600 p-6 text-white">
          <h1 class="text-3xl font-bold text-center">Registrarse</h1>
          <p class="text-center text-white/90">Crea tu cuenta en Vivero Online</p>
        </div>

        <!-- Form -->
        <div class="p-8">
          <!-- Success Alert -->
          <div *ngIf="successMessage" class="mb-4 text-green-700 bg-green-100 p-3 rounded text-sm text-center">
            {{ successMessage }}
            <br>
            <a routerLink="/auth/login" class="underline font-bold mt-2 inline-block">Ir a Iniciar Sesión</a>
          </div>

          <!-- Error Alert -->
          <div *ngIf="errorMessage" class="mb-4 text-red-600 bg-red-100 p-3 rounded text-sm text-center">
            {{ errorMessage }}
          </div>
          
          <ng-container *ngIf="!successMessage">
            <!-- Full Name -->
            <div class="form-group">
              <label for="name" class="label">Nombre Completo</label>
              <input
                id="name"
                [(ngModel)]="fullName"
                type="text"
                placeholder="Juan Pérez"
                class="input"
              >
            </div>

            <!-- Email -->
            <div class="form-group">
              <label for="email" class="label">Correo Electrónico</label>
              <input
                id="email"
                [(ngModel)]="email"
                type="email"
                placeholder="tu@correo.com"
                class="input"
              >
            </div>

            <!-- Phone -->
            <div class="form-group">
              <label for="phone" class="label">Teléfono</label>
              <input
                id="phone"
                [(ngModel)]="phone"
                type="tel"
                placeholder="+34 123 456 789"
                class="input"
              >
            </div>

            <!-- Password -->
            <div class="form-group">
              <label for="password" class="label">Contraseña</label>
              <input
                id="password"
                [(ngModel)]="password"
                type="password"
                placeholder="••••••••"
                class="input"
              >
            </div>

            <!-- Confirm Password -->
            <div class="form-group">
              <label for="confirmPassword" class="label">Confirmar Contraseña</label>
              <input
                id="confirmPassword"
                [(ngModel)]="confirmPassword"
                type="password"
                placeholder="••••••••"
                class="input"
              >
            </div>

            <!-- Terms -->
            <div class="flex items-start gap-2 mb-6">
              <input
                [(ngModel)]="agreeTerms"
                type="checkbox"
                id="terms"
                class="w-4 h-4 text-plant-600 rounded mt-1"
              >
              <label for="terms" class="text-sm text-earth-700">
                Acepto los <a href="#" class="text-plant-600 hover:underline">términos y condiciones</a>
              </label>
            </div>

            <!-- Register Button -->
            <button
              (click)="register()"
              [disabled]="loading"
              class="btn-primary btn-lg w-full mb-4 disabled:opacity-50"
            >
              {{ loading ? 'Creando cuenta...' : 'Crear Cuenta' }}
            </button>
          </ng-container>

          <!-- Login Link -->
          <p *ngIf="!successMessage" class="text-center text-earth-700">
            ¿Ya tienes cuenta?
            <a routerLink="/auth/login" class="text-plant-600 font-bold hover:text-plant-700">
              Inicia sesión
            </a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  fullName = '';
  email = '';
  phone = '';
  password = '';
  confirmPassword = '';
  agreeTerms = false;
  
  loading = false;
  errorMessage = '';
  successMessage = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  register() {
    this.errorMessage = '';
    
    if (!this.fullName || !this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Por favor completa todos los campos requeridos';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    if (!this.agreeTerms) {
      this.errorMessage = 'Debes aceptar los términos y condiciones';
      return;
    }

    this.loading = true;
    this.authService.register({
      fullName: this.fullName,
      email: this.email,
      phone: this.phone,
      password: this.password
    }).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = res.message || 'Cuenta creada correctamente. Ya puedes iniciar sesión.';
      },
      error: (err) => {
        this.loading = false;
        // The backend throws an array of messages if validation pipe fails, or a single message for conflicts.
        const msg = err.error?.message;
        this.errorMessage = Array.isArray(msg) ? msg.join(', ') : (msg || 'Error al intentar registrar la cuenta');
      }
    });
  }
}

