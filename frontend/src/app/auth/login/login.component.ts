import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-plant-50 to-leaf-50 flex items-center justify-center py-12 px-4">
      <div class="card card-border shadow-xl max-w-md w-full">
        <!-- Header -->
        <div class="bg-gradient-to-r from-plant-600 to-leaf-600 p-6 text-white">
          <h1 class="text-3xl font-bold text-center">Bienvenido</h1>
          <p class="text-center text-white/90">Inicia sesión en tu cuenta</p>
        </div>

        <!-- Form -->
        <div class="p-8">
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

          <!-- Remember Me -->
          <div class="flex items-center gap-2 mb-6">
            <input
              [(ngModel)]="rememberMe"
              type="checkbox"
              id="remember"
              class="w-4 h-4 text-plant-600 rounded"
            >
            <label for="remember" class="text-sm text-earth-700">Recuérdame</label>
          </div>

          <!-- Login Button -->
          <button
            (click)="login()"
            class="btn-primary btn-lg w-full mb-4"
          >
            Iniciar Sesión
          </button>

          <!-- Forgot Password -->
          <div class="text-center mb-6">
            <a routerLink="/auth/reset-password" class="text-sm text-plant-600 hover:text-plant-700">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          <!-- Divider -->
          <div class="relative mb-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-stone-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-earth-600">O</span>
            </div>
          </div>

          <!-- Register Link -->
          <p class="text-center text-earth-700">
            ¿No tienes cuenta?
            <a routerLink="/auth/register" class="text-plant-600 font-bold hover:text-plant-700">
              Registrarse
            </a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  email = '';
  password = '';
  rememberMe = false;

  login() {
    if (!this.email || !this.password) {
      alert('Por favor completa todos los campos');
      return;
    }
    console.log('Login:', { email: this.email, password: this.password, rememberMe: this.rememberMe });
    // TODO: Implement auth service
  }
}

