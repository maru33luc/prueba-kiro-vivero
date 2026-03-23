import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="bg-earth-900 text-white mt-16">
      <div class="container py-12">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <!-- About -->
          <div>
            <h3 class="font-bold text-lg mb-4">Vivero Online</h3>
            <p class="text-earth-200 text-sm">
              Tus plantas favoritas, directamente a tu hogar. Calidad garantizada.
            </p>
          </div>

          <!-- Links -->
          <div>
            <h4 class="font-semibold mb-4">Productos</h4>
            <ul class="space-y-2 text-earth-200 text-sm">
              <li><a href="#" class="hover:text-plant-400 transition-colors">Plantas de Interior</a></li>
              <li><a href="#" class="hover:text-plant-400 transition-colors">Plantas de Exterior</a></li>
              <li><a href="#" class="hover:text-plant-400 transition-colors">Accesorios</a></li>
              <li><a href="#" class="hover:text-plant-400 transition-colors">Semillas</a></li>
            </ul>
          </div>

          <!-- Support -->
          <div>
            <h4 class="font-semibold mb-4">Ayuda</h4>
            <ul class="space-y-2 text-earth-200 text-sm">
              <li><a href="#" class="hover:text-plant-400 transition-colors">Preguntas Frecuentes</a></li>
              <li><a href="#" class="hover:text-plant-400 transition-colors">Envíos</a></li>
              <li><a href="#" class="hover:text-plant-400 transition-colors">Devoluciones</a></li>
              <li><a href="#" class="hover:text-plant-400 transition-colors">Contacto</a></li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h4 class="font-semibold mb-4">Contacto</h4>
            <p class="text-earth-200 text-sm mb-2">
              📧 info&#64;vivero-online.com
            </p>
            <p class="text-earth-200 text-sm mb-2">
              📞 +34 123 456 789
            </p>
            <p class="text-earth-200 text-sm">
              🕐 L-V: 9:00 - 18:00
            </p>
          </div>
        </div>

        <div class="border-t border-earth-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p class="text-earth-300 text-sm">
            © 2024 Vivero Online. Todos los derechos reservados.
          </p>
          <div class="flex gap-4 mt-4 md:mt-0">
            <a href="#" class="hover:text-plant-400 transition-colors">Privacidad</a>
            <a href="#" class="hover:text-plant-400 transition-colors">Términos</a>
            <a href="#" class="hover:text-plant-400 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {}
