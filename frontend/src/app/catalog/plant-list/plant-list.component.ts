import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Plant, MOCK_PLANTS } from '../../shared/models/plant.model';

@Component({
  selector: 'app-plant-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container section">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-earth-900 mb-2">Catálogo de Plantas</h1>
        <p class="text-earth-600">Descubre nuestra selección de plantas de alta calidad</p>
      </div>

      <!-- Filters -->
      <div class="flex flex-col md:flex-row gap-4 mb-8">
        <div class="flex-1">
          <input
            [value]="searchTerm"
            (input)="onSearchChange($event)"
            type="text"
            placeholder="Buscar plantas..."
            class="input"
          >
        </div>
        <select
          [value]="selectedCategory"
          (change)="onCategoryChange($event)"
          class="input md:w-48"
        >
          <option value="">Todas las categorías</option>
          <option value="interior">Interior</option>
          <option value="exterior">Exterior</option>
        </select>
        <select
          [value]="sortBy"
          (change)="onSortChange($event)"
          class="input md:w-48"
        >
          <option value="relevance">Relevancia</option>
          <option value="price-asc">Precio: Menor a Mayor</option>
          <option value="price-desc">Precio: Mayor a Menor</option>
          <option value="rating">Mejor Valoradas</option>
        </select>
      </div>

      <!-- Results Count -->
      <p class="text-earth-600 mb-6">{{ filteredPlants.length }} recursos disponibles</p>

      <!-- Products Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div *ngFor="let plant of filteredPlants" class="card card-border hover:shadow-lg transition-all">
          <!-- Image/Icon -->
          <div class="h-40 bg-gradient-to-br from-plant-100 to-leaf-100 flex items-center justify-center text-5xl relative">
            🌱
            <span *ngIf="!plant.inStock" class="absolute top-2 right-2 badge badge-danger">Agotado</span>
            <span *ngIf="plant.inStock" class="absolute top-2 right-2 badge badge-success">Disponible</span>
          </div>

          <!-- Content -->
          <div class="p-5">
            <!-- Rating -->
            <div class="flex items-center gap-1 mb-2">
              <span class="text-yellow-400">★</span>
              <span class="text-sm font-medium text-earth-700">{{ plant.rating.toFixed(1) }}</span>
            </div>

            <!-- Title -->
            <h3 class="font-bold text-earth-900 mb-2 line-clamp-2">{{ plant.name }}</h3>

            <!-- Description -->
            <p class="text-earth-600 text-sm mb-4 line-clamp-2">{{ plant.description }}</p>

            <!-- Category -->
            <div class="mb-3">
              <span class="text-xs font-medium px-2 py-1 bg-plant-50 text-plant-700 rounded">
                {{ plant.category === 'interior' ? '🏠 Interior' : '🌞 Exterior' }}
              </span>
            </div>

            <!-- Price & Actions -->
            <div class="flex justify-between items-center">
              <div>
                <p class="text-sm text-earth-600">Precio</p>
                <p class="text-2xl font-bold text-plant-600">{{ plant.price.toFixed(2) }}</p>
              </div>
              <div class="space-y-2">
                <a [routerLink]="['/catalog', plant.id]">
                  <button class="btn-secondary btn-sm block w-full">
                    Ver
                  </button>
                </a>
                <button
                  (click)="addToCart(plant)"
                  [disabled]="!plant.inStock"
                  [class.opacity-50]="!plant.inStock"
                  [class.cursor-not-allowed]="!plant.inStock"
                  class="btn-primary btn-sm w-full"
                >
                  {{ plant.inStock ? '🛒 Agregar' : 'Agotado' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div *ngIf="filteredPlants.length === 0" class="text-center py-16">
        <p class="text-3xl mb-4">🌾</p>
        <h3 class="text-xl font-bold text-earth-900 mb-2">No hay plantas disponibles</h3>
        <p class="text-earth-600 mb-6">Intenta con otros filtros</p>
        <button (click)="resetFilters()" class="btn-outline">
          Limpiar Filtros
        </button>
      </div>
    </div>
  `,
})
export class PlantListComponent implements OnInit {
  plants: Plant[] = MOCK_PLANTS;
  filteredPlants: Plant[] = [];
  searchTerm = '';
  selectedCategory = '';
  sortBy = 'relevance';

  ngOnInit() {
    this.applyFilters();
  }

  onSearchChange(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  onCategoryChange(event: Event) {
    this.selectedCategory = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  onSortChange(event: Event) {
    this.sortBy = (event.target as HTMLSelectElement).value;
    this.applyFilters();
  }

  applyFilters() {
    let result = this.plants;

    // Filter by search term
    if (this.searchTerm) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (this.selectedCategory) {
      result = result.filter(p => p.category === this.selectedCategory);
    }

    // Sort
    switch (this.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    this.filteredPlants = result;
  }

  resetFilters() {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.sortBy = 'relevance';
    this.applyFilters();
  }

  addToCart(plant: Plant) {
    if (!plant.inStock) return;
    console.log('Added to cart:', plant);
    // TODO: Implement cart service
  }
}

