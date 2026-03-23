import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Plant, MOCK_PLANTS } from '../../shared/models/plant.model';

@Component({
  selector: 'app-plant-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div *ngIf="plant" class="container section">
      <!-- Breadcrumb -->
      <div class="mb-6 flex items-center gap-2 text-sm text-earth-600">
        <a routerLink="/catalog" class="hover:text-plant-600">Catálogo</a>
        <span>/</span>
        <span class="text-earth-900 font-medium">{{ plant.name }}</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Image -->
        <div class="h-96 bg-gradient-to-br from-plant-100 to-leaf-100 rounded-xl flex items-center justify-center text-7xl shadow-lg">
          🌱
        </div>

        <!-- Details -->
        <div>
          <!-- Title -->
          <h1 class="text-4xl font-bold text-earth-900 mb-2">{{ plant.name }}</h1>

          <!-- Rating -->
          <div class="flex items-center gap-2 mb-4">
            <div class="flex text-yellow-400 text-lg">
              <span *ngFor="let i of [1, 2, 3, 4, 5]">
                {{ i <= Math.ceil(plant.rating) ? '★' : '☆' }}
              </span>
            </div>
            <span class="text-earth-700 font-medium">({{ plant.rating }} en 234 reseñas)</span>
          </div>

          <!-- Category & Stock -->
          <div class="flex gap-3 mb-6">
            <span class="badge badge-success">
              {{ plant.category === 'interior' ? '🏠 Interior' : '🌞 Exterior' }}
            </span>
            <span [ngClass]="plant.inStock ? 'badge-success' : 'badge-danger'" class="badge">
              {{ plant.inStock ? '✓ En Stock' : '✗ Agotado' }}
            </span>
          </div>

          <!-- Description -->
          <p class="text-earth-700 text-lg mb-6">{{ plant.description }}</p>

          <!-- Care Info -->
          <div class="bg-plant-50 p-6 rounded-lg mb-6">
            <h3 class="font-bold text-earth-900 mb-4">Información de Cuidado</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-earth-600">☀️ Luz</p>
                <p class="font-medium text-earth-900">Indirecta brillante</p>
              </div>
              <div>
                <p class="text-sm text-earth-600">💧 Riego</p>
                <p class="font-medium text-earth-900">Moderado</p>
              </div>
              <div>
                <p class="text-sm text-earth-600">🌡️ Temperatura</p>
                <p class="font-medium text-earth-900">18-24°C</p>
              </div>
              <div>
                <p class="text-sm text-earth-600">💨 Humedad</p>
                <p class="font-medium text-earth-900">50-70%</p>
              </div>
            </div>
          </div>

          <!-- Price -->
          <div class="mb-6">
            <p class="text-earth-600 text-sm mb-2">Precio</p>
            <p class="text-5xl font-bold text-plant-600">{{ plant.price.toFixed(2) }}</p>
          </div>

          <!-- Quantity & Add to Cart -->
          <div class="flex gap-4 mb-6">
            <div class="flex items-center gap-3 border border-stone-300 rounded-lg p-2">
              <button (click)="decreaseQuantity()" class="w-8 h-8 flex items-center justify-center hover:bg-stone-200 rounded">
                −
              </button>
              <span class="w-8 text-center font-bold">{{ quantity }}</span>
              <button (click)="increaseQuantity()" class="w-8 h-8 flex items-center justify-center hover:bg-stone-200 rounded">
                +
              </button>
            </div>
            <button
              (click)="addToCart()"
              [disabled]="!plant.inStock"
              class="flex-1 btn-primary btn-lg"
            >
              {{ plant.inStock ? '🛒 Agregar al Carrito' : 'Agotado' }}
            </button>
          </div>

          <!-- Additional Actions -->
          <div class="flex gap-3">
            <button class="flex-1 btn-outline">
              ❤️ Agregar a Favoritos
            </button>
            <a routerLink="/catalog">
              <button class="btn-secondary">
                ← Volver
              </button>
            </a>
          </div>
        </div>
      </div>

      <!-- Related Products -->
      <section class="mt-16">
        <h2 class="text-2xl font-bold text-earth-900 mb-6">Plantas Similares</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div *ngFor="let related of relatedPlants" class="card card-border">
            <div class="h-40 bg-gradient-to-br from-plant-100 to-leaf-100 flex items-center justify-center text-3xl">
              🌿
            </div>
            <div class="p-4">
              <h4 class="font-bold text-earth-900 mb-2">{{ related.name }}</h4>
              <p class="text-earth-600 text-sm mb-4">{{ related.description }}</p>
              <div class="flex justify-between items-center">
                <span class="text-plant-600 font-bold">{{ related.price.toFixed(2) }}</span>
                <a [routerLink]="['/catalog', related.id]">
                  <button class="btn-primary btn-sm">Ver</button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
})
export class PlantDetailComponent implements OnInit {
  plant?: Plant;
  relatedPlants: Plant[] = [];
  quantity = 1;
  Math = Math;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = parseInt(params['id']);
      this.plant = MOCK_PLANTS.find(p => p.id === id);
      if (this.plant) {
        this.loadRelatedPlants();
      }
    });
  }

  loadRelatedPlants() {
    if (!this.plant) return;
    this.relatedPlants = MOCK_PLANTS
      .filter(p => p.id !== this.plant!.id && p.category === this.plant!.category)
      .slice(0, 4);
  }

  increaseQuantity() {
    this.quantity++;
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    if (!this.plant || !this.plant.inStock) return;
    console.log(`Adding ${this.quantity}x ${this.plant.name} to cart`);
    // TODO: Implement cart service
  }
}

