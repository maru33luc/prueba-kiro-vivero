import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="order-confirmation">
      <h1>Pedido Confirmado</h1>
      <p>Próximamente...</p>
    </div>
  `,
})
export class OrderConfirmationComponent {}
