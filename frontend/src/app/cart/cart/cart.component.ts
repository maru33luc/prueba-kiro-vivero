import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container section">
      <h1 class="text-4xl font-bold text-earth-900 mb-8">Carrito de Compras</h1>

      <div *ngIf="cartItems.length === 0" class="bg-plant-50 rounded-lg p-12 text-center">
        <p class="text-5xl mb-4">🛒</p>
        <h2 class="text-2xl font-bold text-earth-900 mb-2">Tu carrito está vacío</h2>
        <p class="text-earth-600 mb-6">Comienza a agregar plantas a tu carrito</p>
        <a routerLink="/catalog">
          <button class="btn-primary btn-lg">Explorar Catálogo</button>
        </a>
      </div>

      <div *ngIf="cartItems.length > 0" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Items List -->
        <div class="lg:col-span-2">
          <div class="space-y-4">
            <div *ngFor="let item of cartItems" class="card flex flex-col md:flex-row items-center gap-4 p-4">
              <!-- Image -->
              <div class="w-24 h-24 bg-gradient-to-br from-plant-100 to-leaf-100 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                🌱
              </div>

              <!-- Item Details -->
              <div class="flex-1 min-w-0">
                <h3 class="font-bold text-earth-900">{{ item.name }}</h3>
                <p class="text-plant-600 font-semibold">{{ item.price.toFixed(2) }} c/u</p>
              </div>

              <!-- Quantity -->
              <div class="flex items-center gap-2 border border-stone-300 rounded-lg p-2">
                <button (click)="decreaseQuantity(item.id)" class="w-6 h-6 flex items-center justify-center hover:bg-stone-200 rounded">
                  −
                </button>
                <span class="w-6 text-center font-bold">{{ item.quantity }}</span>
                <button (click)="increaseQuantity(item.id)" class="w-6 h-6 flex items-center justify-center hover:bg-stone-200 rounded">
                  +
                </button>
              </div>

              <!-- Total -->
              <div class="text-right mr-4">
                <p class="text-earth-600 text-sm">Total</p>
                <p class="text-xl font-bold text-plant-600">{{ item.total.toFixed(2) }}</p>
              </div>

              <!-- Remove -->
              <button
                (click)="removeItem(item.id)"
                class="text-red-500 hover:text-red-700 font-bold text-xl"
              >
                ✕
              </button>
            </div>
          </div>

          <!-- Clear Cart -->
          <button
            (click)="clearCart()"
            class="mt-6 btn-outline w-full"
          >
            Vaciar Carrito
          </button>
        </div>

        <!-- Summary -->
        <div class="card card-border p-6 h-fit">
          <h3 class="text-2xl font-bold text-earth-900 mb-6">Resumen</h3>

          <div class="space-y-3 mb-6 pb-6 border-b border-stone-200">
            <div class="flex justify-between">
              <span class="text-earth-700">Subtotal</span>
              <span class="font-medium text-earth-900">{{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-earth-700">Envío</span>
              <span class="font-medium text-earth-900">{{ shipping.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-earth-700">Impuestos (21%)</span>
              <span class="font-medium text-earth-900">{{ taxes.toFixed(2) }}</span>
            </div>
          </div>

          <div class="flex justify-between items-center mb-6">
            <span class="text-lg font-bold text-earth-900">Total</span>
            <span class="text-3xl font-bold text-plant-600">{{ total.toFixed(2) }}</span>
          </div>

          <a routerLink="/checkout">
            <button class="btn-primary btn-lg w-full">
              Proceder al Pago
            </button>
          </a>

          <a routerLink="/catalog">
            <button class="btn-outline w-full mt-3">
              Seguir Comprando
            </button>
          </a>
        </div>
      </div>
    </div>
  `,
})
export class CartComponent {
  cartItems: CartItem[] = [
    { id: 1, name: 'Monstera Deliciosa', price: 45.99, quantity: 2, total: 91.98 },
    { id: 2, name: 'Pothos', price: 24.99, quantity: 1, total: 24.99 },
  ];

  get subtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + item.total, 0);
  }

  get shipping(): number {
    return this.subtotal > 100 ? 0 : 9.99;
  }

  get taxes(): number {
    return (this.subtotal + this.shipping) * 0.21;
  }

  get total(): number {
    return this.subtotal + this.shipping + this.taxes;
  }

  increaseQuantity(id: number) {
    const item = this.cartItems.find(i => i.id === id);
    if (item) {
      item.quantity++;
      item.total = item.price * item.quantity;
    }
  }

  decreaseQuantity(id: number) {
    const item = this.cartItems.find(i => i.id === id);
    if (item && item.quantity > 1) {
      item.quantity--;
      item.total = item.price * item.quantity;
    }
  }

  removeItem(id: number) {
    this.cartItems = this.cartItems.filter(i => i.id !== id);
  }

  clearCart() {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      this.cartItems = [];
    }
  }
}

