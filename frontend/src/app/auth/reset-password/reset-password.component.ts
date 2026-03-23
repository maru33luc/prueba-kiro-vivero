import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-plant-50 to-leaf-50 flex items-center justify-center py-12 px-4">
      <div class="card card-border shadow-xl max-w-md w-full">
        <!-- Header -->
        <div class="bg-gradient-to-r from-plant-600 to-leaf-600 p-6 text-white">
          <h1 class="text-3xl font-bold text-center">Restablecer Contraseña</h1>
          <p class="text-center text-white/90">Recupera tu acceso</p>
        </div>

        <!-- Content -->
        <div class="p-8">
          <div *ngIf="!resetSent" class="space-y-4">
            <p class="text-earth-700 mb-6">
              Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
            </p>

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

            <button
              (click)="sendReset()"
              class="btn-primary btn-lg w-full"
            >
              Enviar Enlace de Recuperación
            </button>

            <a routerLink="/auth/login" class="block text-center text-plant-600 hover:text-plant-700">
              ← Volver a Iniciar Sesión
            </a>
          </div>

          <div *ngIf="resetSent" class="text-center space-y-4">
            <div class="text-5xl mb-4">📧</div>
            <h2 class="text-2xl font-bold text-earth-900">¡Correo Enviado!</h2>
            <p class="text-earth-700">
              Hemos enviado un enlace de recuperación a<br>
              <strong>{{ email }}</strong>
            </p>
            <p class="text-sm text-earth-600">
              Revisa tu bandeja de entrada. Si no lo ves, verifica la carpeta de spam.
            </p>

            <button
              (click)="resetSent = false; email = ''"
              class="btn-primary btn-lg w-full"
            >
              Intentar Con Otro Correo
            </button>

            <a routerLink="/auth/login">
              <button class="btn-outline btn-lg w-full">
                Ir a Iniciar Sesión
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ResetPasswordComponent {
  email = '';
  resetSent = false;

  sendReset() {
    if (!this.email) {
      alert('Por favor ingresa tu correo electrónico');
      return;
    }

    console.log('Password reset requested for:', this.email);
    this.resetSent = true;
  }
}

