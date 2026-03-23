import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="flex flex-col">
      <!-- Hero Section -->
      <section class="bg-gradient-to-br from-plant-50 via-leaf-50 to-white py-20 md:py-32">
        <div class="container">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <!-- Text Content -->
            <div class="space-y-6">
              <h1 class="text-4xl md:text-5xl font-bold text-earth-900 leading-tight">
                Tus<span class="text-plant-600"> Plantas</span> Favoritas, Directo a tu Hogar
              </h1>
              <p class="text-lg text-earth-700">
                Descubre nuestra colección cuidada de plantas de interior y exterior. Calidad garantizada con envío rápido a toda la región.
              </p>
              <div class="flex gap-4 pt-4">
                <a routerLink="/catalog">
                  <button class="btn-primary btn-lg">
                    Explorar Catálogo
                  </button>
                </a>
                <button class="btn-outline btn-lg">
                  Saber Más
                </button>
              </div>
            </div>

            <!-- Hero Image -->
            <div class="h-96 bg-gradient-to-br from-plant-200 to-leaf-200 rounded-2xl flex items-center justify-center text-6xl shadow-lg">
              🌱
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Plants Section -->
      <section class="section">
        <div class="container">
          <h2 class="text-3xl md:text-4xl font-bold text-earth-900 mb-4">Plantas Destacadas</h2>
          <p class="text-earth-700 mb-12">Selecciones especiales para tu espacio</p>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Plant Card 1 -->
            <div class="card">
              <div class="h-48 bg-gradient-to-br from-plant-100 to-leaf-100 flex items-center justify-center text-5xl">
                🪴
              </div>
              <div class="p-4">
                <h3 class="font-bold text-earth-900 mb-2">Monstera Deliciosa</h3>
                <p class="text-earth-600 text-sm mb-4">Planta tropical de gran impacto visual</p>
                <div class="flex justify-between items-center">
                  <span class="text-plant-600 font-bold text-lg">$45.99</span>
                  <button class="btn-primary btn-sm">Agregar</button>
                </div>
              </div>
            </div>

            <!-- Plant Card 2 -->
            <div class="card">
              <div class="h-48 bg-gradient-to-br from-leaf-100 to-plant-100 flex items-center justify-center text-5xl">
                🌿
              </div>
              <div class="p-4">
                <h3 class="font-bold text-earth-900 mb-2">Pothos</h3>
                <p class="text-earth-600 text-sm mb-4">Perfecta para principiantes</p>
                <div class="flex justify-between items-center">
                  <span class="text-plant-600 font-bold text-lg">$24.99</span>
                  <button class="btn-primary btn-sm">Agregar</button>
                </div>
              </div>
            </div>

            <!-- Plant Card 3 -->
            <div class="card">
              <div class="h-48 bg-gradient-to-br from-earth-100 to-plant-100 flex items-center justify-center text-5xl">
                🌵
              </div>
              <div class="p-4">
                <h3 class="font-bold text-earth-900 mb-2">Cactus Premium</h3>
                <p class="text-earth-600 text-sm mb-4">Bajo mantenimiento, máximo estilo</p>
                <div class="flex justify-between items-center">
                  <span class="text-plant-600 font-bold text-lg">$19.99</span>
                  <button class="btn-primary btn-sm">Agregar</button>
                </div>
              </div>
            </div>

            <!-- Plant Card 4 -->
            <div class="card">
              <div class="h-48 bg-gradient-to-br from-plant-100 to-earth-100 flex items-center justify-center text-5xl">
                🌺
              </div>
              <div class="p-4">
                <h3 class="font-bold text-earth-900 mb-2">Orquídea Elegante</h3>
                <p class="text-earth-600 text-sm mb-4">Sofisticada y duradera</p>
                <div class="flex justify-between items-center">
                  <span class="text-plant-600 font-bold text-lg">$59.99</span>
                  <button class="btn-primary btn-sm">Agregar</button>
                </div>
              </div>
            </div>
          </div>

          <div class="text-center mt-12">
            <a routerLink="/catalog">
              <button class="btn-outline btn-lg">Ver Todas las Plantas</button>
            </a>
          </div>
        </div>
      </section>

      <!-- Benefits Section -->
      <section class="section bg-plant-50">
        <div class="container">
          <h2 class="text-3xl font-bold text-earth-900 mb-12 text-center">¿Por Qué Nosotros?</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Benefit 1 -->
            <div class="text-center">
              <div class="w-16 h-16 bg-plant-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                ✓
              </div>
              <h3 class="font-bold text-earth-900 mb-2">Garantía de Calidad</h3>
              <p class="text-earth-700">
                Todas nuestras plantas son inspeccionadas cuidadosamente antes de enviarlas
              </p>
            </div>

            <!-- Benefit 2 -->
            <div class="text-center">
              <div class="w-16 h-16 bg-leaf-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                🚚
              </div>
              <h3 class="font-bold text-earth-900 mb-2">Envío Rápido</h3>
              <p class="text-earth-700">
                Entrega en 2-3 días hábiles con embalaje seguro especial
              </p>
            </div>

            <!-- Benefit 3 -->
            <div class="text-center">
              <div class="w-16 h-16 bg-plant-700 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                💚
              </div>
              <h3 class="font-bold text-earth-900 mb-2">Atención Experta</h3>
              <p class="text-earth-700">
                Consejos de cuidado personalizados para cada planta
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="section bg-gradient-to-r from-plant-600 to-leaf-600">
        <div class="container text-center">
          <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Comienza tu Colección Hoy</h2>
          <p class="text-white/90 mb-8 max-w-2xl mx-auto">
            Únete a miles de clientes que ya disfrutan de sus plantas. Obtén descuentos especiales en tu primer pedido.
          </p>
          <a routerLink="/catalog">
            <button class="bg-white text-plant-600 hover:bg-stone-100 font-bold py-3 px-8 rounded-lg transition-colors">
              Explorar Ahora
            </button>
          </a>
        </div>
      </section>
    </div>
  `,
})
export class HomeComponent {}
