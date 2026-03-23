import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container section">
      <!-- Breadcrumb -->
      <div class="mb-6 flex items-center gap-2 text-sm text-earth-600">
        <a routerLink="/orders" class="hover:text-plant-600">Mis Órdenes</a>
        <span>/</span>
        <span class="text-earth-900 font-medium">Orden #ORD-2024-001</span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Status Timeline -->
          <div class="card card-border p-6">
            <h2 class="text-2xl font-bold text-earth-900 mb-6">Estado del Pedido</h2>
            <div class="relative">
              <div class="space-y-4">
                <!-- Status Item: Pending -->
                <div class="flex gap-4">
                  <div class="flex flex-col items-center">
                    <div class="w-8 h-8 rounded-full bg-plant-600 text-white flex items-center justify-center text-sm font-bold">
                      ✓
                    </div>
                    <div class="w-0.5 h-12 bg-plant-600 my-2"></div>
                  </div>
                  <div>
                    <h4 class="font-bold text-earth-900">Pedido Confirmado</h4>
                    <p class="text-earth-600 text-sm">15 de Marzo, 10:30 AM</p>
                  </div>
                </div>

                <!-- Status Item: Processing -->
                <div class="flex gap-4">
                  <div class="flex flex-col items-center">
                    <div class="w-8 h-8 rounded-full bg-plant-600 text-white flex items-center justify-center text-sm font-bold">
                      ✓
                    </div>
                    <div class="w-0.5 h-12 bg-plant-600 my-2"></div>
                  </div>
                  <div>
                    <h4 class="font-bold text-earth-900">Procesando</h4>
                    <p class="text-earth-600 text-sm">15 de Marzo, 02:15 PM</p>
                  </div>
                </div>

                <!-- Status Item: Shipped -->
                <div class="flex gap-4">
                  <div class="flex flex-col items-center">
                    <div class="w-8 h-8 rounded-full bg-plant-600 text-white flex items-center justify-center text-sm font-bold">
                      ✓
                    </div>
                    <div class="w-0.5 h-12 bg-stone-300 my-2"></div>
                  </div>
                  <div>
                    <h4 class="font-bold text-earth-900">Enviado</h4>
                    <p class="text-earth-600 text-sm">16 de Marzo, 09:00 AM</p>
                    <p class="text-sm text-plant-600 font-medium mt-1">Número de seguimiento: ES123456789</p>
                  </div>
                </div>

                <!-- Status Item: Delivered -->
                <div class="flex gap-4">
                  <div class="flex flex-col items-center">
                    <div class="w-8 h-8 rounded-full bg-stone-300 text-stone-600 flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                  </div>
                  <div>
                    <h4 class="font-bold text-earth-900">Entrega Esperada</h4>
                    <p class="text-earth-600 text-sm">20 de Marzo, 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Items -->
          <div class="card card-border p-6">
            <h2 class="text-2xl font-bold text-earth-900 mb-6">Artículos del Pedido</h2>
            <div class="space-y-4">
              <div *ngFor="let item of items" class="flex items-center justify-between p-4 bg-stone-50 rounded-lg">
                <div class="flex items-center gap-4">
                  <div class="w-16 h-16 bg-gradient-to-br from-plant-100 to-leaf-100 rounded flex items-center justify-center text-2xl">
                    🌱
                  </div>
                  <div>
                    <h4 class="font-bold text-earth-900">{{ item.name }}</h4>
                    <p class="text-earth-600">Cantidad: {{ item.quantity }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-earth-600 text-sm">{{ item.price.toFixed(2) }} c/u</p>
                  <p class="text-lg font-bold text-plant-600">{{ (item.price * item.quantity).toFixed(2) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Shipping Address -->
          <div class="card card-border p-6">
            <h2 class="text-2xl font-bold text-earth-900 mb-4">Dirección de Envío</h2>
            <div class="text-earth-700 space-y-1">
              <p class="font-semibold">Juan Pérez</p>
              <p>Calle Principal 123</p>
              <p>Madrid, 28001</p>
              <p class="mt-3">+34 123 456 789</p>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Order Summary -->
          <div class="card card-border p-6">
            <h3 class="text-xl font-bold text-earth-900 mb-6">Resumen</h3>

            <div class="space-y-3 pb-4 border-b border-stone-200">
              <div class="flex justify-between">
                <span class="text-earth-700">Número de Orden</span>
                <span class="font-bold text-earth-900">ORD-2024-001</span>
              </div>
              <div class="flex justify-between">
                <span class="text-earth-700">Fecha</span>
                <span class="font-bold text-earth-900">15/03/2024</span>
              </div>
              <div class="flex justify-between">
                <span class="text-earth-700">Estado</span>
                <span class="badge badge-warning">Enviado</span>
              </div>
            </div>

            <div class="mt-4 space-y-3">
              <div class="flex justify-between">
                <span class="text-earth-700">Subtotal</span>
                <span>$116.97</span>
              </div>
              <div class="flex justify-between">
                <span class="text-earth-700">Envío</span>
                <span>$9.99</span>
              </div>
              <div class="flex justify-between pb-3 border-b border-stone-200">
                <span class="text-earth-700">Impuestos</span>
                <span>$24.57</span>
              </div>
              <div class="flex justify-between">
                <span class="text-lg font-bold text-earth-900">Total</span>
                <span class="text-2xl font-bold text-plant-600">$151.53</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="space-y-2">
            <button class="btn-primary w-full">
              Descargar Factura
            </button>
            <button class="btn-secondary w-full">
              Rastrear Envío
            </button>
            <button class="btn-outline w-full">
              Contactar Soporte
            </button>
          </div>

          <!-- Related Actions -->
          <a routerLink="/orders">
            <button class="btn-outline w-full">
              ← Volver
            </button>
          </a>
        </div>
      </div>
    </div>
  `,
})
export class OrderDetailComponent implements OnInit {
  items: OrderItem[] = [
    { name: 'Monstera Deliciosa', price: 45.99, quantity: 2 },
    { name: 'Pothos', price: 24.99, quantity: 1 },
    { name: 'Lirio de Paz', price: 39.99, quantity: 1 },
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const orderId = params['id'];
      // TODO: Load order details from service
      console.log('Loading order details for:', orderId);
    });
  }
}

