import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-order-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-order-list">
      <h1>Gestión de Pedidos</h1>
      <p>Próximamente...</p>
    </div>
  `,
})
export class AdminOrderListComponent {}
