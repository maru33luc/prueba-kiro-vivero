import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container section">
      <h1 class="text-4xl font-bold text-earth-900 mb-8">Checkout</h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Checkout Form -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Shipping Information -->
          <div class="card card-border p-6">
            <h2 class="text-2xl font-bold text-earth-900 mb-6">Dirección de Envío</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-group">
                <label class="label">Nombre Completo</label>
                <input [(ngModel)]="shipping.fullName" type="text" class="input" placeholder="Juan Pérez">
              </div>
              <div class="form-group">
                <label class="label">Teléfono</label>
                <input [(ngModel)]="shipping.phone" type="tel" class="input" placeholder="+34 123 456 789">
              </div>
              <div class="form-group md:col-span-2">
                <label class="label">Dirección</label>
                <input [(ngModel)]="shipping.address" type="text" class="input" placeholder="Calle Principal 123">
              </div>
              <div class="form-group">
                <label class="label">Ciudad</label>
                <input [(ngModel)]="shipping.city" type="text" class="input" placeholder="Madrid">
              </div>
              <div class="form-group">
                <label class="label">Código Postal</label>
                <input [(ngModel)]="shipping.zipCode" type="text" class="input" placeholder="28001">
              </div>
            </div>
          </div>

          <!-- Shipping Method -->
          <div class="card card-border p-6">
            <h2 class="text-2xl font-bold text-earth-900 mb-6">Método de Envío</h2>
            <div class="space-y-3">
              <label class="flex items-center gap-3 p-3 border border-stone-300 rounded-lg cursor-pointer hover:bg-plant-50">
                <input [(ngModel)]="shippingMethod" type="radio" value="standard" class="w-4 h-4 text-plant-600">
                <div class="flex-1">
                  <p class="font-semibold text-earth-900">Envío Estándar - $9.99</p>
                  <p class="text-sm text-earth-600">Entrega en 5-7 días hábiles</p>
                </div>
              </label>
              <label class="flex items-center gap-3 p-3 border border-stone-300 rounded-lg cursor-pointer hover:bg-leaf-50">
                <input [(ngModel)]="shippingMethod" type="radio" value="express" class="w-4 h-4 text-leaf-600">
                <div class="flex-1">
                  <p class="font-semibold text-earth-900">Envío Express - $29.99</p>
                  <p class="text-sm text-earth-600">Entrega en 2-3 días hábiles</p>
                </div>
              </label>
              <label class="flex items-center gap-3 p-3 border border-stone-300 rounded-lg cursor-pointer hover:bg-plant-50">
                <input [(ngModel)]="shippingMethod" type="radio" value="free" class="w-4 h-4 text-plant-600">
                <div class="flex-1">
                  <p class="font-semibold text-earth-900">Envío Gratuito</p>
                  <p class="text-sm text-earth-600">Compras mayores a $100 (8-10 días)</p>
                </div>
              </label>
            </div>
          </div>

          <!-- Payment Method -->
          <div class="card card-border p-6">
            <h2 class="text-2xl font-bold text-earth-900 mb-6">Método de Pago</h2>
            <div class="space-y-4">
              <label class="flex items-center gap-3 p-3 border border-stone-300 rounded-lg cursor-pointer hover:bg-plant-50">
                <input [(ngModel)]="paymentMethod" type="radio" value="card" class="w-4 h-4 text-plant-600">
                <span class="font-semibold text-earth-900">💳 Tarjeta de Crédito/Débito</span>
              </label>
              <label class="flex items-center gap-3 p-3 border border-stone-300 rounded-lg cursor-pointer hover:bg-plant-50">
                <input [(ngModel)]="paymentMethod" type="radio" value="paypal" class="w-4 h-4 text-plant-600">
                <span class="font-semibold text-earth-900">🅿️ PayPal</span>
              </label>
              <label class="flex items-center gap-3 p-3 border border-stone-300 rounded-lg cursor-pointer hover:bg-plant-50">
                <input [(ngModel)]="paymentMethod" type="radio" value="transfer" class="w-4 h-4 text-plant-600">
                <span class="font-semibold text-earth-900">🏦 Transferencia Bancaria</span>
              </label>
            </div>

            <!-- Card Details (if card selected) -->
            <div *ngIf="paymentMethod === 'card'" class="mt-6 pt-6 border-t border-stone-200 space-y-4">
              <div class="form-group">
                <label class="label">Número de Tarjeta</label>
                <input [(ngModel)]="card.number" type="text" class="input" placeholder="1234 5678 9012 3456">
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="form-group">
                  <label class="label">Expiración</label>
                  <input [(ngModel)]="card.expiry" type="text" class="input" placeholder="MM/YY">
                </div>
                <div class="form-group">
                  <label class="label">CVV</label>
                  <input [(ngModel)]="card.cvv" type="text" class="input" placeholder="***">
                </div>
              </div>
            </div>
          </div>

          <!-- Terms -->
          <div class="flex items-start gap-2 p-4 bg-plant-50 rounded-lg">
            <input [(ngModel)]="agreeTerms" type="checkbox" id="agree" class="w-4 h-4 text-plant-600 rounded mt-1">
            <label for="agree" class="text-sm text-earth-700">
              Acepto los <a href="#" class="text-plant-600 hover:underline">términos y condiciones</a> y la <a href="#" class="text-plant-600 hover:underline">política de privacidad</a>
            </label>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="card card-border p-6 h-fit">
          <h3 class="text-2xl font-bold text-earth-900 mb-6">Resumen del Pedido</h3>

          <!-- Items -->
          <div class="space-y-3 mb-6 pb-6 border-b border-stone-200">
            <div class="flex justify-between">
              <span class="text-earth-700">Monstera Deliciosa x2</span>
              <span class="font-medium text-earth-900">$91.98</span>
            </div>
            <div class="flex justify-between">
              <span class="text-earth-700">Pothos x1</span>
              <span class="font-medium text-earth-900">$24.99</span>
            </div>
          </div>

          <!-- Totals -->
          <div class="space-y-3 mb-6 pb-6 border-b border-stone-200">
            <div class="flex justify-between">
              <span class="text-earth-700">Subtotal</span>
              <span class="font-medium">$116.97</span>
            </div>
            <div class="flex justify-between">
              <span class="text-earth-700">Envío</span>
              <span class="font-medium">{{ shippingCost }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-earth-700">Impuestos (21%)</span>
              <span class="font-medium">$24.57</span>
            </div>
          </div>

          <div class="flex justify-between items-center mb-6">
            <span class="text-lg font-bold text-earth-900">Total</span>
            <span class="text-3xl font-bold text-plant-600">$166.27</span>
          </div>

          <!-- Place Order Button -->
          <button
            (click)="placeOrder()"
            [disabled]="!agreeTerms"
            class="btn-primary btn-lg w-full mb-3"
          >
            Confirmar Pedido
          </button>

          <a routerLink="/cart">
            <button class="btn-outline w-full">
              ← Volver al Carrito
            </button>
          </a>
        </div>
      </div>
    </div>
  `,
})
export class CheckoutComponent {
  shipping = {
    fullName: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
  };

  shippingMethod = 'standard';
  paymentMethod = 'card';
  agreeTerms = false;

  card = {
    number: '',
    expiry: '',
    cvv: '',
  };

  get shippingCost(): string {
    switch (this.shippingMethod) {
      case 'express':
        return '$29.99';
      case 'free':
        return '$0.00';
      default:
        return '$9.99';
    }
  }

  placeOrder() {
    if (!this.agreeTerms) {
      alert('Debes aceptar los términos y condiciones');
      return;
    }

    if (!this.shipping.fullName || !this.shipping.address || !this.shipping.city) {
      alert('Por favor completa tu dirección de envío');
      return;
    }

    console.log('Placing order...', {
      shipping: this.shipping,
      shippingMethod: this.shippingMethod,
      paymentMethod: this.paymentMethod,
    });

    // TODO: Implement order service
    alert('Pedido confirmado. ¡Gracias por tu compra!');
  }
}

