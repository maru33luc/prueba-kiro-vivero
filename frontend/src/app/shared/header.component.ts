import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="sticky top-0 z-50 bg-white border-b border-stone-200 shadow-sm">
      <div class="container">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-plant-600 rounded-lg flex items-center justify-center text-white font-bold">
              🌿
            </div>
            <a routerLink="/" class="text-xl font-bold text-plant-600 hover:text-plant-700">
              Vivero Online
            </a>
          </div>

          <!-- Navigation -->
          <nav class="hidden md:flex items-center gap-8">
            <a routerLink="/catalog" routerLinkActive="text-plant-600 font-semibold" [routerLinkActiveOptions]="{exact: false}" class="text-earth-700 hover:text-plant-600">
              Catálogo
            </a>
            <a routerLink="/orders" routerLinkActive="text-plant-600 font-semibold" [routerLinkActiveOptions]="{exact: false}" class="text-earth-700 hover:text-plant-600">
              Mis Órdenes
            </a>
            <a routerLink="/admin" routerLinkActive="text-plant-600 font-semibold" [routerLinkActiveOptions]="{exact: false}" class="text-earth-700 hover:text-plant-600">
              Admin
            </a>
          </nav>

          <!-- Actions -->
          <div class="flex items-center gap-4">
            <a routerLink="/cart" class="relative">
              <button class="btn-secondary btn-sm">
                🛒 Carrito
              </button>
            </a>
            <div class="flex gap-2">
              <a routerLink="/auth/login">
                <button class="btn-outline btn-sm">Ingresar</button>
              </a>
              <a routerLink="/auth/register">
                <button class="btn-primary btn-sm">Registrarse</button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {}
