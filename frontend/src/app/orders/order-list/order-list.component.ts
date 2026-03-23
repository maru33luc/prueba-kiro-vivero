import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  total: number;
  items: number;
}

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container section">
      <h1 class="text-4xl font-bold text-earth-900 mb-8">Mis Órdenes</h1>

      <div *ngIf="orders.length === 0" class="bg-plant-50 rounded-lg p-12 text-center">
        <p class="text-5xl mb-4">📦</p>
        <h2 class="text-2xl font-bold text-earth-900 mb-2">No tienes órdenes</h2>
        <p class="text-earth-600 mb-6">Comienza a comprar en nuestro catálogo</p>
        <a routerLink="/catalog">
          <button class="btn-primary btn-lg">Explorar Catálogo</button>
        </a>
      </div>

      <div *ngIf="orders.length > 0" class="space-y-4">
        <div *ngFor="let order of orders" class="card card-border hover:shadow-lg transition-shadow">
          <div class="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <!-- Order Info -->
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <h3 class="font-bold text-earth-900 text-lg">Orden #{{ order.id }}</h3>
                <span [ngClass]="getStatusClass(order.status)" class="badge">
                  {{ getStatusLabel(order.status) }}
                </span>
              </div>
              <div class="text-earth-600 space-y-1">
                <p class="text-sm">📅 {{ order.date }}</p>
                <p class="text-sm">📦 {{ order.items }} artículo(s)</p>
              </div>
            </div>

            <!-- Amount -->
            <div class="text-right">
              <p class="text-earth-600 text-sm">Total</p>
              <p class="text-2xl font-bold text-plant-600">{{ order.total.toFixed(2) }}</p>
            </div>

            <!-- Action -->
            <a [routerLink]="['/orders', order.id]">
              <button class="btn-secondary btn-sm">Ver Detalles</button>
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class OrderListComponent {
  orders: Order[] = [
    {
      id: 'ORD-2024-001',
      date: '15 de Marzo, 2024',
      status: 'delivered',
      total: 156.27,
      items: 3,
    },
    {
      id: 'ORD-2024-002',
      date: '10 de Marzo, 2024',
      status: 'shipped',
      total: 89.99,
      items: 1,
    },
    {
      id: 'ORD-2024-003',
      date: '05 de Marzo, 2024',
      status: 'processing',
      total: 199.50,
      items: 4,
    },
  ];

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      pending: 'Pendiente',
      processing: 'Procesando',
      shipped: 'Enviado',
      delivered: 'Entregado',
    };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      pending: 'badge-warning',
      processing: 'badge-warning',
      shipped: 'badge-warning',
      delivered: 'badge-success',
    };
    return classes[status] || 'badge-warning';
  }
}

