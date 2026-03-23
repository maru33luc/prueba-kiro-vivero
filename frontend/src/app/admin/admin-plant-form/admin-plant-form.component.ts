import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-plant-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container section">
      <h1 class="text-4xl font-bold text-earth-900 mb-8">Gestión de Plantas</h1>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <!-- Stats -->
        <div class="card card-border p-6 text-center">
          <p class="text-stone-600 text-sm mb-2">Total de Plantas</p>
          <p class="text-4xl font-bold text-plant-600">42</p>
        </div>
        <div class="card card-border p-6 text-center">
          <p class="text-stone-600 text-sm mb-2">En Stock</p>
          <p class="text-4xl font-bold text-leaf-600">38</p>
        </div>
        <div class="card card-border p-6 text-center">
          <p class="text-stone-600 text-sm mb-2">Agotadas</p>
          <p class="text-4xl font-bold text-red-600">4</p>
        </div>
        <div class="card card-border p-6 text-center">
          <p class="text-stone-600 text-sm mb-2">Valor Total</p>
          <p class="text-4xl font-bold text-plant-600">$8,547</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Form -->
        <div class="lg:col-span-2">
          <div class="card card-border p-6">
            <h2 class="text-2xl font-bold text-earth-900 mb-6">{{ editingId ? 'Editar Planta' : 'Nueva Planta' }}</h2>

            <div class="space-y-4">
              <!-- Name -->
              <div class="form-group">
                <label class="label">Nombre</label>
                <input [(ngModel)]="form.name" type="text" class="input" placeholder="Nombre de la planta">
              </div>

              <!-- Description -->
              <div class="form-group">
                <label class="label">Descripción</label>
                <textarea [(ngModel)]="form.description" class="input" placeholder="Descripción de la planta" rows="3"></textarea>
              </div>

              <!-- Price & Stock -->
              <div class="grid grid-cols-2 gap-4">
                <div class="form-group">
                  <label class="label">Precio</label>
                  <input [(ngModel)]="form.price" type="number" class="input" placeholder="0.00" min="0" step="0.01">
                </div>
                <div class="form-group">
                  <label class="label">Stock</label>
                  <input [(ngModel)]="form.stock" type="number" class="input" placeholder="0" min="0">
                </div>
              </div>

              <!-- Category -->
              <div class="form-group">
                <label class="label">Categoría</label>
                <select [(ngModel)]="form.category" class="input">
                  <option value="">Seleccionar...</option>
                  <option value="interior">Interior</option>
                  <option value="exterior">Exterior</option>
                </select>
              </div>

              <!-- Buttons -->
              <div class="flex gap-3">
                <button (click)="savePlant()" class="btn-primary flex-1">
                  {{ editingId ? 'Guardar Cambios' : 'Crear Planta' }}
                </button>
                <button (click)="resetForm()" class="btn-outline">
                  Limpiar
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Plants -->
        <div class="card card-border p-6">
          <h3 class="text-xl font-bold text-earth-900 mb-4">Plantas Recientes</h3>
          <div class="space-y-2">
            <div *ngFor="let plant of recentPlants" class="p-3 bg-stone-50 rounded-lg hover:bg-stone-100 cursor-pointer transition-colors">
              <h4 class="font-medium text-earth-900">{{ plant }}</h4>
              <p class="text-xs text-earth-600">Hace 2 días</p>
              <div class="flex gap-2 mt-2">
                <button (click)="editPlant(plant)" class="btn-secondary btn-sm text-xs">Editar</button>
                <button (click)="deletePlant(plant)" class="btn-outline btn-sm text-xs">Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Plants List -->
      <div class="mt-8">
        <div class="card card-border overflow-hidden">
          <div class="p-6 border-b border-stone-200">
            <h2 class="text-2xl font-bold text-earth-900">Inventario</h2>
            <input
              [(ngModel)]="searchTerm"
              type="text"
              placeholder="Buscar plantas..."
              class="input mt-4"
            >
          </div>

          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-earth-900">Nombre</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-earth-900">Categoría</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-earth-900">Precio</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-earth-900">Stock</th>
                  <th class="px-6 py-3 text-left text-sm font-semibold text-earth-900">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let plant of plants" class="border-b border-stone-200 hover:bg-stone-50">
                  <td class="px-6 py-4 text-earth-900 font-medium">{{ plant }}</td>
                  <td class="px-6 py-4 text-earth-600">Interior</td>
                  <td class="px-6 py-4 text-plant-600 font-semibold">$45.99</td>
                  <td class="px-6 py-4">
                    <span class="badge badge-success">12</span>
                  </td>
                  <td class="px-6 py-4">
                    <button class="btn-secondary btn-sm mr-2">Editar</button>
                    <button class="btn-outline btn-sm">Eliminar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AdminPlantFormComponent {
  form = {
    name: '',
    description: '',
    price: 0,
    stock: 0,
    category: '',
  };

  editingId = '';
  searchTerm = '';

  plants = [
    'Monstera Deliciosa',
    'Pothos',
    'Cactus Echinocereus',
    'Orquídea Phalaenopsis',
    'Helecho de Boston',
  ];

  recentPlants = [
    'Palmera Areca',
    'Ave del Paraíso',
    'Lirio de Paz',
  ];

  savePlant() {
    if (!this.form.name || !this.form.category) {
      alert('Por favor completa los campos obligatorios');
      return;
    }
    console.log('Saving plant:', this.form);
    alert(this.editingId ? 'Planta actualizada' : 'Planta creada');
    this.resetForm();
  }

  resetForm() {
    this.form = {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      category: '',
    };
    this.editingId = '';
  }

  editPlant(plantName: string) {
    this.editingId = plantName;
    this.form.name = plantName;
  }

  deletePlant(plantName: string) {
    if (confirm(`¿Estás seguro de que quieres eliminar "${plantName}"?`)) {
      console.log('Deleting plant:', plantName);
    }
  }
}

